import { bootApp } from './generated/core.js';
import { Router, Motherboard } from './runtime_v44.js';
import { TextureManager, ParticleManager } from './graphics.js';
import { initCartDB, saveCartBuffer, loadCartBuffer } from './storage.js';
import { parseStaticBin, parseDynamicBin, setupEnvironment } from './data.js';

let saveTimeout;
window.syncCartData = function(rowIndex, addedQty) {
    if (window.DB_CART_QTY) {
        window.DB_CART_QTY[rowIndex] += addedQty;
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => { saveCartBuffer(window.cartDb, window.DB_CART_QTY.buffer); }, 500);
    }
};

window.CURRENT_TAG = '#all';
window.filterByTag = function(tag) {
    if (!window.TAG_INDEX[tag]) return;
    window.CURRENT_TAG = tag;
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX[tag];
    window.MB.initVirtualScroll('ProductItem', '#product-grid', window.CURRENT_VIEW_INDICES, 140, (instanceMbId, rowData, rowIndex) => {
        window.MB.sendSignal(instanceMbId, "V_INDEX", rowIndex);
    });
    const grid = document.getElementById('product-grid');
    if (grid) grid.scrollTop = 0;
    const label = document.getElementById('tag-label');
    if (label) label.innerText = `${tag} (${window.CURRENT_VIEW_INDICES.length} món)`;
};

const appRoutes = {
    '/': { 
        name: 'HomeView',
        fetcher: async () => {
            const [js, html] = await Promise.all([
                import('./generated/HomeView.js'), 
                import('../views/home.html?raw') // Vite dodHtmlLoader sẽ biến cái này thành String
            ]);
            return { factory: js.default, html: html.default };
        }
    },
    '/cart': {
        name: 'Cart',
        fetcher: async () => {
            const [js, html] = await Promise.all([
                import('./generated/Cart.js'), 
                import('../views/cart.html?raw')
            ]);
            return { factory: js.default, html: html.default };
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

    // Khởi tạo Lazy Component: Modal và Product Pool
    import('./generated/PopupModal.js').then(m => {
        Motherboard.registerLazy('PopupModal', m.default, '#modal-tpl', '#modal-container');
    });
    
    import('./generated/ProductItem.js').then(m => {
        // Chỉ tạo Pool khi user đang ở trang Home (có thẻ #product-grid)
        const initPool = () => {
            if (document.querySelector('#product-grid')) {
                Motherboard.initObjectPool('ProductItem', m.default, '#product-grid', 20);
                window.removeEventListener('DOMNodeInserted', initPool);
            }
        };
        if (document.querySelector('#product-grid')) initPool();
        else window.addEventListener('DOMNodeInserted', initPool); // Đợi Router cắm thẻ vào
    });

    // Kích hoạt Router
    Router.init('#app-root', appRoutes);

    // Đồng bộ số lượng giỏ hàng ban đầu
    let totalQ = 0; let totalS = 0;
    for(let i = 0; i < window.DB_CART_QTY.length; i++) {
        const q = window.DB_CART_QTY[i];
        if (q > 0) { totalQ += q; totalS += q * window.DB.prices[i]; }
    }
    
    // Ép tạo Cart instance ngầm (Headless) để nó nhận dữ liệu ngay cả khi chưa vào trang /cart
    if (totalQ > 0) {
        import('./generated/Cart.js').then(m => {
            const tempDiv = document.createElement('div');
            tempDiv.style.display = 'none';
            document.body.appendChild(tempDiv);
            m.default(tempDiv); // Hydrate Headless
            Motherboard.callAction('Cart', 'SYNC_CART_ACTION', totalQ, Math.floor(totalS));
        });
    }

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