// pack_db.js
import fs from 'fs';

// Giả lập 10,000 sản phẩm (Thực tế bạn sẽ kéo từ MongoDB/MySQL)
const products = [];
for (let i = 0; i < 10000; i++) {
    products.push({ id: 1000 + i, price: Math.floor(Math.random() * 500) * 1000 + 50000, stock: Math.floor(Math.random() * 20), name: `Sản phẩm siêu tốc ${i}` });
}

const N = products.length;
let stringBytesLen = 0;
const encoder = new TextEncoder();
const encodedNames = products.map(p => {
    const buf = encoder.encode(p.name);
    stringBytesLen += buf.length;
    return buf;
});

const HEADER_SIZE = 8; 
const TOTAL_BYTES = HEADER_SIZE + (N * 4) + (N * 8) + (N * 4) + (N * 4) + (N * 4) + stringBytesLen;

const buffer = new ArrayBuffer(TOTAL_BYTES);
const view = new DataView(buffer);

view.setInt32(0, N, true); 
view.setInt32(4, stringBytesLen, true);

let cursor = HEADER_SIZE;
const ids = new Int32Array(buffer, cursor, N); cursor += N * 4;
const prices = new Float64Array(buffer, cursor, N); cursor += N * 8;
const stocks = new Int32Array(buffer, cursor, N); cursor += N * 4;
const offsets = new Int32Array(buffer, cursor, N); cursor += N * 4;
const lengths = new Int32Array(buffer, cursor, N); cursor += N * 4;
const stringMem = new Uint8Array(buffer, cursor, stringBytesLen);

let strOffset = 0;
for (let i = 0; i < N; i++) {
    ids[i] = products[i].id;
    prices[i] = products[i].price;
    stocks[i] = products[i].stock;
    
    offsets[i] = strOffset;
    lengths[i] = encodedNames[i].length;
    stringMem.set(encodedNames[i], strOffset);
    strOffset += encodedNames[i].length;
}

// Lưu file vào thư mục public (hoặc nơi chứa index.html của bạn)
fs.writeFileSync('./products.bin', Buffer.from(buffer));
console.log(`✅ Đã đóng gói ${N} SP. Dung lượng siêu nhỏ: ${(TOTAL_BYTES / 1024).toFixed(2)} KB`);