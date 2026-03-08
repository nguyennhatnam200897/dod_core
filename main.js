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
// NGHIỆP VỤ DỰ ÁN
// ==========================================
async function loadProjectData() {
    console.log("[Project] Đang tải products.bin...");
    const res = await fetch('./products.bin');
    const buffer = await res.arrayBuffer();
    const view = new DataView(buffer);
    const N = view.getInt32(0, true);
    const stringBytesLen = view.getInt32(4, true);
    
    let cursor = 8;
    window.DB = {}; 
    window.DB.ids = new Int32Array(buffer, cursor, N); cursor += N * 4;
    window.DB.prices = new Float64Array(buffer, cursor, N); cursor += N * 8;
    window.DB.stocks = new Int32Array(buffer, cursor, N); cursor += N * 4;
    window.DB.nameOffsets = new Int32Array(buffer, cursor, N); cursor += N * 4;
    window.DB.nameLengths = new Int32Array(buffer, cursor, N); cursor += N * 4;
    
    setDbStringMem(new Uint8Array(buffer, cursor, stringBytesLen));
    window.DB_DUMMY_ARRAY = new Array(N).fill(0);

    // 🌟 1. TẠO CHỈ MỤC ĐẢO NGƯỢC (INVERTED INDEX) O(1)
    window.TAG_INDEX = {
        '#all': new Int32Array(N).map((_, i) => i), // Danh sách gốc: 0, 1, 2... N
        '#sale': [],
        '#sneaker': [],
        '#aothun': []
    };

    // Giả lập Dữ liệu Hashtag ngẫu nhiên cho 100k sản phẩm
    for(let i = 0; i < N; i++) {
        if (i % 5 === 0) window.TAG_INDEX['#sale'].push(i);
        if (i % 7 === 0) window.TAG_INDEX['#sneaker'].push(i);
        if (i % 3 === 0) window.TAG_INDEX['#aothun'].push(i);
    }

    // Ép kiểu mảng rác JS thành Mảng Nhị phân O(1) để tối ưu RAM
    window.TAG_INDEX['#sale'] = new Int32Array(window.TAG_INDEX['#sale']);
    window.TAG_INDEX['#sneaker'] = new Int32Array(window.TAG_INDEX['#sneaker']);
    window.TAG_INDEX['#aothun'] = new Int32Array(window.TAG_INDEX['#aothun']);

    // Mảng Tham Chiếu (Indirection Array) đang hiển thị hiện tại
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX['#all'];

    // 🌟 KHÔI PHỤC RAM TỪ INDEXED DB
    window.cartDb = await initCartDB();
    const savedBuffer = await loadCartBuffer(window.cartDb);
    
    // Nếu đã từng lưu và kích thước file không đổi
    if (savedBuffer && savedBuffer.byteLength === N * 4) {
        window.DB_CART_QTY = new Int32Array(savedBuffer); // Ép thẳng cục Byte vào RAM (Zero-Parse)
        console.log("♻️ Đã khôi phục giỏ hàng nhị phân (0ms).");
    } else {
        window.DB_CART_QTY = new Int32Array(N); // Cấp phát mới
    }
}

let saveTimeout;
window.syncCartData = function(rowIndex, addedQty) {
    if (window.DB_CART_QTY) {
        window.DB_CART_QTY[rowIndex] += addedQty;
        
        // 🌟 THUẬT TOÁN DEBOUNCE LƯU NỀN
        // Không lưu liên tục gây hại ổ cứng, chờ user ngừng bấm 500ms mới Dump RAM 1 lần
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveCartBuffer(window.cartDb, window.DB_CART_QTY.buffer);
        }, 500);
    }
};

// 🌟 2. HÀM TÌM KIẾM SIÊU TỐC O(1)
window.filterByTag = function(tag) {
    if (!window.TAG_INDEX[tag]) return;
    
    // 1. Tráo con trỏ RAM (Chi phí thời gian: 0ms)
    window.CURRENT_VIEW_INDICES = window.TAG_INDEX[tag];
    
    // 2. Báo cho Bo mạch chủ (Engine) render lại Virtual Scroll với danh sách mới
    window.MB.initVirtualScroll('ProductItem', '#product-grid', window.CURRENT_VIEW_INDICES, 140, (instanceMbId, rowData, rowIndex) => {
        window.MB.sendSignal(instanceMbId, "V_INDEX", rowIndex);
    });
    
    // 3. Reset thanh cuộn về đầu và cập nhật nhãn
    document.getElementById('product-grid').scrollTop = 0;
    document.getElementById('tag-label').innerText = `${tag} (${window.CURRENT_VIEW_INDICES.length} món)`;
};

async function main() {
    await loadProjectData();
    TextureManager.init();
    ParticleManager.init();
    await bootApp();         

    // 🌟 ĐỒNG BỘ HIỂN THỊ GIỎ HÀNG LÚC KHỞI ĐỘNG
    let totalQ = 0;
    let totalS = 0;
    for(let i = 0; i < window.DB_CART_QTY.length; i++) {
        const q = window.DB_CART_QTY[i];
        if (q > 0) {
            totalQ += q;
            totalS += q * window.DB.prices[i];
        }
    }
    
    // Bơm số vào cho Component Cart xử lý giao diện
    if (totalQ > 0) {
        window.MB.callAction('Cart', 'SYNC_CART_ACTION', totalQ, Math.floor(totalS));
    }
}

main();