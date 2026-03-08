// pack_db.js
import fs from 'fs';

const N_PRODUCTS = 100000;
const N_TAGS = 2000;

// ... (Giữ nguyên phần sinh mảng products và invertedIndex như cũ của bạn) ...
const allTags = [];
for (let i = 0; i < N_TAGS; i++) { allTags.push(`#tag_${i}`); }
allTags[0] = '#sale'; allTags[1] = '#sneaker'; allTags[2] = '#aothun'; allTags[3] = '#all'; 

const invertedIndex = new Map();
allTags.forEach(t => invertedIndex.set(t, []));

const products = [];
for (let i = 0; i < N_PRODUCTS; i++) {
    products.push({ id: 1000 + i, price: Math.floor(Math.random() * 500) * 1000 + 50000, stock: Math.floor(Math.random() * 20), name: `Sản phẩm siêu tốc ${i}` });
    invertedIndex.get('#all').push(i);
    const numTags = Math.floor(Math.random() * 40) + 10;
    const usedTags = new Set();
    for (let j = 0; j < numTags; j++) {
        const randomTagIdx = Math.floor(Math.random() * N_TAGS);
        if (!usedTags.has(randomTagIdx) && allTags[randomTagIdx] !== '#all') {
            usedTags.add(randomTagIdx);
            invertedIndex.get(allTags[randomTagIdx]).push(i);
        }
    }
}

// 🌟 HÀM ĐÚC FILE NHỊ PHÂN
function exportBin(prodList, tagMap, filename) {
    let stringBytesLen = 0;
    const encoder = new TextEncoder();

    const encodedProductNames = prodList.map(p => {
        const buf = encoder.encode(p.name);
        stringBytesLen += buf.length;
        return buf;
    });

    const tagNames = Array.from(tagMap.keys());
    const NUM_TAGS = tagNames.length;
    let FLAT_INDICES_LEN = 0;

    const encodedTagNames = [];
    const tagProductCounts = [];
    const tagFlatLists = []; 

    tagNames.forEach(tag => {
        const buf = encoder.encode(tag);
        stringBytesLen += buf.length;
        encodedTagNames.push(buf);

        const list = tagMap.get(tag);
        tagProductCounts.push(list.length);
        tagFlatLists.push(new Int32Array(list)); 
        FLAT_INDICES_LEN += list.length;
    });

    const N = prodList.length;
    const HEADER_SIZE = 16; 
    const PROD_COL_BYTES = (N * 8) + (N * 4) + (N * 4) + (N * 4) + (N * 4);
    const TAG_COL_BYTES = (NUM_TAGS * 4) + (NUM_TAGS * 4) + (NUM_TAGS * 4) + (NUM_TAGS * 4);
    const FLAT_LIST_BYTES = FLAT_INDICES_LEN * 4;

    const TOTAL_BYTES = HEADER_SIZE + PROD_COL_BYTES + TAG_COL_BYTES + FLAT_LIST_BYTES + stringBytesLen;
    const buffer = new ArrayBuffer(TOTAL_BYTES);
    const view = new DataView(buffer);

    view.setInt32(0, N, true);
    view.setInt32(4, NUM_TAGS, true);
    view.setInt32(8, stringBytesLen, true);
    view.setInt32(12, FLAT_INDICES_LEN, true);

    let cursor = HEADER_SIZE;
    const prices = new Float64Array(buffer, cursor, N); cursor += N * 8;
    const ids = new Int32Array(buffer, cursor, N); cursor += N * 4;
    const stocks = new Int32Array(buffer, cursor, N); cursor += N * 4;
    const pOffsets = new Int32Array(buffer, cursor, N); cursor += N * 4;
    const pLengths = new Int32Array(buffer, cursor, N); cursor += N * 4;

    const tOffsets = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const tLengths = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const tStarts = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;
    const tCounts = new Int32Array(buffer, cursor, NUM_TAGS); cursor += NUM_TAGS * 4;

    const flatIndices = new Int32Array(buffer, cursor, FLAT_INDICES_LEN); cursor += FLAT_INDICES_LEN * 4;
    const stringMem = new Uint8Array(buffer, cursor, stringBytesLen);

    let strOffset = 0;
    for (let i = 0; i < N; i++) {
        prices[i] = prodList[i].price; ids[i] = prodList[i].id; stocks[i] = prodList[i].stock;
        pOffsets[i] = strOffset; pLengths[i] = encodedProductNames[i].length;
        stringMem.set(encodedProductNames[i], strOffset); strOffset += encodedProductNames[i].length;
    }

    let flatOffset = 0;
    for (let i = 0; i < NUM_TAGS; i++) {
        tOffsets[i] = strOffset; tLengths[i] = encodedTagNames[i].length;
        stringMem.set(encodedTagNames[i], strOffset); strOffset += encodedTagNames[i].length;
        tStarts[i] = flatOffset; tCounts[i] = tagProductCounts[i];
        flatIndices.set(tagFlatLists[i], flatOffset); flatOffset += tagProductCounts[i];
    }

    fs.writeFileSync(filename, Buffer.from(buffer));
    console.log(`✅ Đã xuất ${filename} - Dung lượng: ${(TOTAL_BYTES / 1024).toFixed(2)} KB`);
}

// 🌟 XUẤT 2 PHIÊN BẢN:
// 1. Bản Lite siêu nhẹ (140 sản phẩm, chỉ cần tag #all để hiển thị màn hình đầu)
const liteProducts = products.slice(0, 140);
const liteTags = new Map();
liteTags.set('#all', Array.from({length: 140}, (_, i) => i));
exportBin(liteProducts, liteTags, './public/products_lite.bin');

// 2. Bản Full khổng lồ (17MB)
exportBin(products, invertedIndex, './public/products_full.bin');