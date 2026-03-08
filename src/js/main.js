import { bootApp } from './app_compiled.js';
import { TextureManager, ParticleManager } from './graphics.js';
import { initCartDB, saveCartBuffer, loadCartBuffer } from './storage.js';
import { parseStaticBin, parseDynamicBin, setupEnvironment } from './data.js';

// Quản lý Giỏ hàng (Giữ nguyên)
let saveTimeout;
window.syncCartData = function(rowIndex, addedQty) {
    if (window.DB_CART_QTY) {
        window.DB_CART_QTY[rowIndex] += addedQty;
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => { saveCartBuffer(window.cartDb, window.DB_CART_QTY.buffer); }, 500);
    }
};

// Tìm kiếm Hashtag (Giữ nguyên)
window.CURRENT_TAG = '#all';
window.filterByTag = function(tag) {
    if (!window.TAG_INDEX[tag]) return;
    window.CURRENT_TAG = tag;
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX[tag];
    window.MB.initVirtualScroll('ProductItem', '#product-grid', window.CURRENT_VIEW_INDICES, 140, (instanceMbId, rowData, rowIndex) => {
        window.MB.sendSignal(instanceMbId, "V_INDEX", rowIndex);
    });
    document.getElementById('product-grid').scrollTop = 0;
    document.getElementById('tag-label').innerText = `${tag} (${window.CURRENT_VIEW_INDICES.length} món)`;
};

// 🌟 4. TIẾN TRÌNH KHỞI ĐỘNG CHÍNH
async function main() {
    // Dùng Promise.all để tải Lạnh và Nóng song song
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

    let totalQ = 0; let totalS = 0;
    for(let i = 0; i < window.DB_CART_QTY.length; i++) {
        const q = window.DB_CART_QTY[i];
        if (q > 0) { totalQ += q; totalS += q * window.DB.prices[i]; }
    }
    if (totalQ > 0) window.MB.callAction('Cart', 'SYNC_CART_ACTION', totalQ, Math.floor(totalS));

    console.log("🚀 Fast Boot đã xong! Đang tải Full Data...");

    // TẢI NỀN BẢN FULL (Tách Nóng Lạnh)
    try {
        const [staticFull, dynamicFull] = await Promise.all([
            // Tải bản Lạnh (Mặc định sẽ được Trình duyệt Cache vĩnh viễn)
            parseStaticBin('./data/static_full.bin'),
            
            // 🌟 CACHE BUSTER CHO BẢN NÓNG: Ép trình duyệt luôn kéo giá và tồn kho mới nhất
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