import { bootApp } from './app_compiled.js';
import { setDbStringMem } from './runtime_v44.js';

// ==========================================
// TẦNG RENDER ĐỒ HỌA (TEXTURE MANAGER)
// ==========================================
class TextureManager {
    static cache = new Map(); // Nơi lưu trữ Bitmap
    static loading = new Set();
    
    static init() {
        // Vòng lặp Render độc lập (Đồng bộ với tần số quét của màn hình)
        const renderLoop = () => {
            const canvases = document.getElementsByClassName('product-canvas');
            const texIds = document.getElementsByClassName('tex-id');
            
            for (let i = 0; i < canvases.length; i++) {
                const canvas = canvases[i];
                const idStr = texIds[i].textContent;
                if (!idStr) continue;
                
                const id = parseInt(idStr, 10);
                
                // Chỉ vẽ lại nếu ID bị thay đổi do Virtual Scroll
                if (canvas._lastId !== id) {
                    canvas._lastId = id;
                    const ctx = canvas.getContext('2d', { alpha: false }); // alpha:false tắt trong suốt giúp tăng tốc độ render GPU
                    
                    if (this.cache.has(id)) {
                        // Ảnh đã có trong VRAM -> Vẽ siêu tốc O(1)
                        ctx.drawImage(this.cache.get(id), 0, 0, 80, 80);
                    } else {
                        // Xóa khung cũ thành nền xám
                        ctx.fillStyle = '#f1f5f9';
                        ctx.fillRect(0, 0, 80, 80);
                        
                        // Nạp ngầm hình ảnh
                        this.preload(id, canvas);
                    }
                }
            }
            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);
    }
    
    static async preload(id, canvas) {
        if (this.loading.has(id)) return;
        this.loading.add(id);
        
        try {
            // 🌟 THUẬT TOÁN DEBOUNCE: Chờ 50ms xem user có đang lướt nhanh quá không
            await new Promise(r => setTimeout(r, 50));
            // Nếu ID của Canvas đã đổi (Tức là user lướt qua luôn rồi), Hủy tải ngay lập tức!
            if (canvas._lastId !== id) return; 

            // Tải ảnh ngẫu nhiên từ Picsum
            const res = await fetch(`https://picsum.photos/seed/${id}/80/80`);
            const blob = await res.blob();
            
            // Giải mã ảnh thành Bitmap siêu tốc ở một luồng Background
            const bitmap = await createImageBitmap(blob);
            this.cache.set(id, bitmap);
            
            // 🌟 QUẢN LÝ BỘ NHỚ CƠ HỌC: Nếu vượt 500 ảnh, Xóa ảnh cũ nhất khỏi VRAM!
            if (this.cache.size > 500) {
                const firstKey = this.cache.keys().next().value;
                const oldBitmap = this.cache.get(firstKey);
                if (oldBitmap && oldBitmap.close) oldBitmap.close(); // Chặn đứng Memory Leak
                this.cache.delete(firstKey);
            }
            
            // Đánh dấu canvas cần vẽ lại ở frame tiếp theo
            if (canvas._lastId === id) canvas._lastId = null; 
            
        } catch (e) {
            // Lỗi mạng, bỏ qua
        } finally {
            this.loading.delete(id);
        }
    }
}

// ==============================================
// 🌟 HỆ THỐNG HẠT GIAO DIỆN (UI PARTICLE SYSTEM)
// ==============================================
class ParticleManager {
    static pool = [];
    static poolSize = 10;
    static currentIndex = 0;
    static targetRect = null;

    static init() {
        // 1. Pre-allocate (Cấp phát trước) 10 Canvas Hạt vào DOM
        for (let i = 0; i < this.poolSize; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            canvas.className = 'particle';
            document.body.appendChild(canvas);
            this.pool.push(canvas);
        }

        // 2. Lắng nghe cú click Toàn cục (Tách bạch khỏi Logic Engine)
        document.addEventListener('click', (e) => {
            // Chỉ kích hoạt nếu bấm vào nút "Thêm vào giỏ" và nút đó CHƯA bị khóa (còn hàng)
            if (e.target.classList.contains('btn-buy') && !e.target.classList.contains('btn-disabled')) {
                // Tìm thẻ Canvas của chính sản phẩm đó
                const card = e.target.closest('.product-card');
                const sourceCanvas = card ? card.querySelector('.product-canvas') : null;
                
                this.spawn(e.clientX, e.clientY, sourceCanvas);
            }
        });
    }

    static spawn(startX, startY, sourceCanvas) {
        // Lấy tọa độ Giỏ hàng đích đến (Chỉ lấy 1 lần rồi Cache lại)
        if (!this.targetRect) {
            const cartEl = document.getElementById('cart-qty');
            if (cartEl) this.targetRect = cartEl.getBoundingClientRect();
        }

        // 3. Bốc 1 Hạt từ Bể chứa (Object Pooling)
        const particle = this.pool[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.poolSize;

        // 4. Reset Hạt về vị trí chuột (Tắt transition để dịch chuyển tức thời)
        particle.classList.remove('flying');
        particle.style.transform = `translate(${startX - 30}px, ${startY - 30}px) scale(1)`;
        particle.style.opacity = '1';

        // 5. Zero-Allocation VRAM Copy: Đổ mực từ ảnh gốc sang Hạt
        const ctx = particle.getContext('2d', { alpha: false });
        if (sourceCanvas) {
            ctx.drawImage(sourceCanvas, 0, 0, 60, 60);
        } else {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(0, 0, 60, 60);
        }

        // 6. Ép trình duyệt vẽ lại khung hình (Reflow) để chốt vị trí Start
        void particle.offsetWidth; 

        // 7. Kích hoạt bay vào giỏ hàng
        particle.classList.add('flying');
        
        const endX = this.targetRect ? this.targetRect.left - 15 : window.innerWidth - 100;
        const endY = this.targetRect ? this.targetRect.top - 15 : 50;
        
        // Hạt thu nhỏ dần và mờ đi khi chui vào giỏ
        particle.style.transform = `translate(${endX}px, ${endY}px) scale(0.2)`;
        particle.style.opacity = '0';
    }
}

// ==========================================
// 🌟 LƯU TRỮ NHỊ PHÂN (BINARY PERSISTENCE) O(1)
// ==========================================
const DB_NAME = 'DOD_ECommerce';
const STORE_NAME = 'CartStore';

// 1. Khởi tạo kết nối Ổ cứng
function initCartDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE_NAME);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// 2. Dump RAM xuống ổ cứng
function saveCartBuffer(db, buffer) {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(buffer, 'cart_qty'); // Đổ nguyên cục Buffer xuống
}

// 3. Xúc RAM từ ổ cứng lên
function loadCartBuffer(db) {
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get('cart_qty');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}

// ==========================================
// NGHIỆP VỤ DỰ ÁN (TIẾN TRÌNH KHỞI ĐỘNG 2 GIAI ĐOẠN)
// ==========================================

// 🌟 1. HÀM LÕI: Tải và cắt file Nhị phân thành các mảng RAM
// Hàm này dùng chung cho cả việc tải bản Lite (10KB) và bản Full (17MB)
async function parseBinaryToRAM(url) {
    console.log(`[Tiến trình] Đang tải ${url}...`);
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const view = new DataView(buffer);
    
    const N = view.getInt32(0, true);
    const NUM_TAGS = view.getInt32(4, true);
    const stringBytesLen = view.getInt32(8, true);
    const FLAT_INDICES_LEN = view.getInt32(12, true);
    
    let cursor = 16;
    const dbData = {}; 
    
    dbData.prices = new Float64Array(buffer, cursor, N); cursor += N * 8;
    dbData.ids = new Int32Array(buffer, cursor, N); cursor += N * 4;
    dbData.stocks = new Int32Array(buffer, cursor, N); cursor += N * 4;
    dbData.nameOffsets = new Int32Array(buffer, cursor, N); cursor += N * 4;
    dbData.nameLengths = new Int32Array(buffer, cursor, N); cursor += N * 4;
    
    const tOffsets = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const tLengths = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const tStarts = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const tCounts = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const flatIndices = new Int32Array(buffer, cursor, FLAT_INDICES_LEN); cursor += FLAT_INDICES_LEN * 4;
    
    const strMem = new Uint8Array(buffer, cursor, stringBytesLen);
    
    const tagIndex = {};
    const decoder = new TextDecoder();
    for(let i = 0; i < NUM_TAGS; i++) {
        const tagName = decoder.decode(strMem.subarray(tOffsets[i], tOffsets[i] + tLengths[i]));
        tagIndex[tagName] = flatIndices.subarray(tStarts[i], tStarts[i] + tCounts[i]);
    }

    return { N, dbData, strMem, tagIndex };
}

// 🌟 2. HÀM HOT-SWAP: Rút phích cắm cục RAM cũ, cắm cục RAM mới vào
async function setupEnvironment(parsedData) {
    window.DB = parsedData.dbData;
    setDbStringMem(parsedData.strMem);
    window.TAG_INDEX = parsedData.tagIndex;
    window.DB_DUMMY_ARRAY = new Array(parsedData.N).fill(0);
    
    // BẢO TỒN GIỎ HÀNG: Khi tráo RAM từ Lite sang Full, ta phải chép lại dữ liệu Giỏ hàng 
    // mà khách vừa bấm mua trong lúc chờ tải bản Full sang cục RAM mới.
    const oldCart = window.DB_CART_QTY;
    window.DB_CART_QTY = new Int32Array(parsedData.N);
    if (oldCart) {
        window.DB_CART_QTY.set(oldCart.subarray(0, Math.min(oldCart.length, parsedData.N)));
    }
}

// Hàm lưu giỏ hàng xuống ổ cứng (Giữ nguyên)
let saveTimeout;
window.syncCartData = function(rowIndex, addedQty) {
    if (window.DB_CART_QTY) {
        window.DB_CART_QTY[rowIndex] += addedQty;
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveCartBuffer(window.cartDb, window.DB_CART_QTY.buffer);
        }, 500);
    }
};

// 🌟 3. HÀM TÌM KIẾM SIÊU TỐC
window.CURRENT_TAG = '#all'; // Ghi nhớ Tag người dùng đang xem
window.filterByTag = function(tag) {
    if (!window.TAG_INDEX[tag]) return;
    window.CURRENT_TAG = tag; // Ghi nhớ lại
    
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX[tag];
    window.MB.initVirtualScroll('ProductItem', '#product-grid', window.CURRENT_VIEW_INDICES, 140, (instanceMbId, rowData, rowIndex) => {
        window.MB.sendSignal(instanceMbId, "V_INDEX", rowIndex);
    });
    
    document.getElementById('product-grid').scrollTop = 0;
    document.getElementById('tag-label').innerText = `${tag} (${window.CURRENT_VIEW_INDICES.length} món)`;
};

// 🌟 4. TIẾN TRÌNH KHỞI ĐỘNG CHÍNH
async function main() {
    // ---- GIAI ĐOẠN 1: FAST BOOT ----
    // Tải bản LITE cực nhanh (140 sản phẩm đầu tiên)
    const liteData = await parseBinaryToRAM('./public/products_lite.bin');
    await setupEnvironment(liteData);
    
    // Khởi động Ổ cứng và khôi phục Giỏ hàng cũ (nếu có)
    window.cartDb = await initCartDB();
    const savedBuffer = await loadCartBuffer(window.cartDb);
    if (savedBuffer) window.DB_CART_QTY.set(new Int32Array(savedBuffer).subarray(0, liteData.N));

    // Kích hoạt giao diện
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX['#all'];
    TextureManager.init();
    ParticleManager.init();
    await bootApp();         

    // Hiển thị Giỏ hàng lên UI ngay lập tức
    let totalQ = 0; let totalS = 0;
    for(let i = 0; i < window.DB_CART_QTY.length; i++) {
        const q = window.DB_CART_QTY[i];
        if (q > 0) { totalQ += q; totalS += q * window.DB.prices[i]; }
    }
    if (totalQ > 0) window.MB.callAction('Cart', 'SYNC_CART_ACTION', totalQ, Math.floor(totalS));

    console.log("🚀 Giao diện đã sẵn sàng (Fast Boot). Đang tải nền dữ liệu Full...");

    // ---- GIAI ĐOẠN 2: BACKGROUND LOAD & HOT-SWAP ----
    // Tải bản Full 17MB ở chế độ nền mà không làm đơ trang Web
    try {
        const fullData = await parseBinaryToRAM('./public/products_full.bin');
        
        // Tráo đổi cục RAM trong lúc Engine vẫn đang chạy mượt mà
        await setupEnvironment(fullData);
        
        // Kích hoạt lại bộ lọc hiện tại để ép Engine dọn Cache và chọc vào vùng RAM mới
        window.filterByTag(window.CURRENT_TAG);
        
        console.log("🔥 Đã Hot-Swap thành công dữ liệu Full (17MB) mà không làm gián đoạn UI!");
    } catch (e) {
        console.error("Lỗi tải nền dữ liệu Full:", e);
    }
}

main();