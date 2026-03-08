// ==========================================
// 🌟 LƯU TRỮ NHỊ PHÂN (BINARY PERSISTENCE) O(1)
// ==========================================
const DB_NAME = 'DOD_ECommerce';
const STORE_NAME = 'CartStore';

// 1. Khởi tạo kết nối Ổ cứng
export function initCartDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => e.target.result.createObjectStore(STORE_NAME);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// 2. Dump RAM xuống ổ cứng
export function saveCartBuffer(db, buffer) {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(buffer, 'cart_qty'); // Đổ nguyên cục Buffer xuống
}

// 3. Xúc RAM từ ổ cứng lên
export function loadCartBuffer(db) {
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get('cart_qty');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}