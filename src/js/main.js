import { bootApp } from './generated/core.js';
import { Router, Motherboard, initObjectPool } from './runtime_v44.js';
import { TextureManager, ParticleManager } from './graphics.js';
import { initCartDB, saveCartBuffer, loadCartBuffer } from './storage.js';
import { parseStaticBin, parseDynamicBin, setupEnvironment } from './data.js';

// 🌟 SỔ LIÊN LẠC: Ánh xạ ID của Thẻ -> ID của Sản phẩm đang hiển thị
window.cardRowMap = new Map(); 

let saveTimeout;
window.syncCartData = function(rowIndex, addedQty) {
    // 🌟 TRẠM GÁC: Chặn đứng lỗi Click vô hạn. Nếu hết hàng (addedQty = 0) thì ngắt ngay lập tức!
    if (!addedQty || addedQty === 0) return; 

    if (window.DB_CART_QTY) {
        window.DB_CART_QTY[rowIndex] += addedQty;
        
        for (let [mbId, rIndex] of window.cardRowMap.entries()) {
            if (rIndex === rowIndex) {
                window.MB.sendSignal(mbId, "PORT_CART_QTY", window.DB_CART_QTY[rowIndex]);
            }
        }

        let totalQ = 0; let totalS = 0;
        for(let i = 0; i < window.DB_CART_QTY.length; i++) {
            const q = window.DB_CART_QTY[i];
            if (q > 0) { totalQ += q; totalS += q * window.DB.prices[i]; }
        }
        
        Motherboard.callAction('HeaderView', 'SYNC_HEADER_CART', totalQ);
        if (Motherboard.nameToId.has('Cart')) {
            window.MB.sendSignal('Cart', 'PORT_CART_QTY', totalQ);
            window.MB.sendSignal('Cart', 'PORT_CART_SUBTOTAL', totalS);
        }

        window.MB.wakeUp(); // Đánh thức hệ thống

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => { saveCartBuffer(window.cartDb, window.DB_CART_QTY.buffer); }, 500);
    }
};

window.CURRENT_TAG = '#all';
window.filterByTag = function(tag) {
    if (!window.TAG_INDEX[tag]) return;
    window.CURRENT_TAG = tag;
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX[tag];
    
    window.cardRowMap.clear(); 
    
    window.MB.initVirtualScroll('ProductItem', '#product-grid', window.CURRENT_VIEW_INDICES, 140, (instanceMbId, rowData, rowIndex) => {
        window.MB.sendSignal(instanceMbId, "V_INDEX", rowIndex);
        
        const realRowIndex = rowData; 
        
        // 🌟 DỰ ÁN BƠM DATA VÀO LÕI ENGINE (SINGLE SOURCE OF TRUTH)
        window.MB.sendSignal(instanceMbId, "PORT_REAL_INDEX", realRowIndex);
        window.MB.sendSignal(instanceMbId, "PORT_ID", window.DB.ids[realRowIndex]);
        window.MB.sendSignal(instanceMbId, "PORT_PRICE", window.DB.prices[realRowIndex]);
        window.MB.sendSignal(instanceMbId, "PORT_STOCK", window.DB.stocks[realRowIndex]);

        const qty = window.DB_CART_QTY ? window.DB_CART_QTY[realRowIndex] : 0;
        window.MB.sendSignal(instanceMbId, "PORT_CART_QTY", qty);
        window.cardRowMap.set(instanceMbId, realRowIndex);

        // Bypass DOD: JS tự gán Tên Sản phẩm 
        const nameOffset = window.DB.nameOffsets[realRowIndex];
        const nameLength = window.DB.nameLengths[realRowIndex];
        if (nameOffset !== undefined) {
            const nameStr = window.getDbString(nameOffset, nameLength);
            const compId = window.MB.nameToId.get(instanceMbId);
            const comp = window.MB.components[compId];
            if (comp && comp._rootNode) {
                const nameEl = comp._rootNode.querySelector('.product-name');
                if (nameEl && nameEl.textContent !== nameStr) nameEl.textContent = nameStr;
            }
        }
    });
    
    const grid = document.getElementById('product-grid');
    if (grid) grid.scrollTop = 0;
    const label = document.getElementById('tag-label');
    if (label) label.innerText = `${tag} (${window.CURRENT_VIEW_INDICES.length} món)`;
};

// =========================================================
// 🌟 LOGIC DỰ ÁN: XỬ LÝ VÒNG ĐỜI (LẮNG NGHE TỪ ENGINE)
// =========================================================
window.addEventListener('dod:view-plugged', (e) => {
    const viewName = e.detail;
    if (viewName === 'HomeView') {
        // Khi quay lại trang chủ, vét lại sổ liên lạc và bơm số lượng mới nhất vào 20 Thẻ
        for (let [mbId, rIndex] of window.cardRowMap.entries()) {
            const qty = window.DB_CART_QTY ? window.DB_CART_QTY[rIndex] : 0;
            window.MB.sendSignal(mbId, "PORT_CART_QTY", qty);
        }
    }
});

const appRoutes = {
    '/': { 
        name: 'HomeView',
        fetcher: async () => {
            // 🌟 Tải song song cả 3: Logic Home, HTML Home và Logic của Thẻ Sản Phẩm
            const [js, html, productItemJs] = await Promise.all([
                import('./generated/HomeView.js'), 
                import('../views/home.html?raw'),
                import('./generated/ProductItem.js') // Tải trước chuẩn bị sẵn
            ]);
            
            return { 
                html: html.default, 
                // 🌟 Tự custom lại luồng Factory để tiêm Object Pool vào
                factory: (rootNode) => {
                    // Bước 1: Khởi tạo Pool TRƯỚC (DOM lúc này đã được Router bơm vào rồi)
                    if (!Motherboard.pools['ProductItem']) {
                        initObjectPool('ProductItem', productItemJs.default, '#product-grid', 20);
                    }
                    
                    // Bước 2: Kích hoạt HomeView. Lúc này initVirtualScroll gọi ra chắc chắn 100% có Pool để xài.
                    return js.default(rootNode);
                }
            };
        }
    },
    '/cart': {
        name: 'Cart',
        fetcher: async () => {
            const [js, html] = await Promise.all([
                import('./generated/Cart.js'), 
                import('../views/cart.html?raw')
            ]);
            return { 
                html: html.default, 
                factory: (rootNode) => {
                    const instance = js.default(rootNode);
                    
                    let totalQ = 0; let totalS = 0;
                    if (window.DB_CART_QTY) {
                        for(let i = 0; i < window.DB_CART_QTY.length; i++) {
                            const q = window.DB_CART_QTY[i];
                            if (q > 0) { totalQ += q; totalS += q * window.DB.prices[i]; }
                        }
                    }
                    // 🌟 BẮN TÍN HIỆU LÚC MỞ TRANG (THAY CHO callAction)
                    Motherboard.sendSignal('Cart', 'PORT_CART_QTY', totalQ);
                    Motherboard.sendSignal('Cart', 'PORT_CART_SUBTOTAL', totalS);
                    
                    return instance;
                }
            };
        }
    }
};

async function main() {
    const [staticLite, dynamicLite] = await Promise.all([
        parseStaticBin('./data/static_lite.bin'),
        parseDynamicBin('./data/dynamic_lite.bin')
    ]);
    
    await setupEnvironment(staticLite, dynamicLite);
    
    window.cartDb = await initCartDB();
    const savedBuffer = await loadCartBuffer(window.cartDb);
    if (savedBuffer) window.DB_CART_QTY.set(new Int32Array(savedBuffer).subarray(0, staticLite.N));

    window.CURRENT_VIEW_INDICES = window.TAG_INDEX['#all'];
    TextureManager.init();
    ParticleManager.init();
    await bootApp();         

    import('./generated/PopupModal.js').then(m => {
        Motherboard.registerLazy('PopupModal', m.default, '#modal-tpl', '#modal-container');
    });

    // 🌟 KHỞI ĐỘNG COMPONENT HEADER (Cắm rễ ngay lập tức)
    import('./generated/HeaderView.js').then(m => {
        const headerNode = document.querySelector('.top-nav');
        if (headerNode) {
            m.default(headerNode); // Cấp phát RAM và Hydrate Header
            
            // Khôi phục số lượng giỏ hàng ban đầu lúc tải trang
            let totalQ = 0; 
            for(let i = 0; i < window.DB_CART_QTY.length; i++) {
                totalQ += window.DB_CART_QTY[i];
            }
            if (totalQ > 0) {
                Motherboard.callAction('HeaderView', 'SYNC_HEADER_CART', totalQ);
            }
        }
    });

    Router.init('#app-root', appRoutes);

    console.log("🚀 Fast Boot đã xong! Đang tải Full Data...");

    try {
        const [staticFull, dynamicFull] = await Promise.all([
            parseStaticBin('./data/static_full.bin'),
            parseDynamicBin('./data/dynamic_full.bin?t=' + Date.now()) 
        ]);
        
        await setupEnvironment(staticFull, dynamicFull);
        window.filterByTag(window.CURRENT_TAG);
        console.log("🔥 Đã Hot-Swap thành công kiến trúc Hot/Cold Splitting!");
    } catch (e) {
        console.error("Lỗi Hot-Swap:", e);
    }
}

main();