import { setDbStringMem } from './runtime_v44.js';

// ==========================================
// NGHIỆP VỤ DỰ ÁN (KIẾN TRÚC HOT/COLD SPLITTING)
// ==========================================

// 1. Giải mã Dữ liệu Lạnh (Tĩnh)
export async function parseStaticBin(url) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const view = new DataView(buffer);
    const N = view.getInt32(0, true);
    const stringBytesLen = view.getInt32(4, true);

    let cursor = 8;
    const dbData = {};
    dbData.ids = new Int32Array(buffer, cursor, N); cursor += N * 4;
    dbData.nameOffsets = new Int32Array(buffer, cursor, N); cursor += N * 4;
    dbData.nameLengths = new Int32Array(buffer, cursor, N); cursor += N * 4;

    const strMem = new Uint8Array(buffer, cursor, stringBytesLen);
    return { N, dbData, strMem };
}

// 2. Giải mã Dữ liệu Nóng (Động)
export async function parseDynamicBin(url) {
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
    dbData.stocks = new Int32Array(buffer, cursor, N); cursor += N * 4;

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

    return { dbData, tagIndex };
}

// 3. Phép thuật Hợp nhất Mảng (Merging)
export async function setupEnvironment(staticData, dynamicData) {
    // Ép mảng Lạnh và mảng Nóng vào chung 1 Object duy nhất cho Engine xài
    window.DB = { ...staticData.dbData, ...dynamicData.dbData };
    
    // Engine chỉ cần đọc Tên sản phẩm, nên ta chỉ cấp phát strMem của bản Lạnh
    setDbStringMem(staticData.strMem); 
    
    window.TAG_INDEX = dynamicData.tagIndex;
    window.DB_DUMMY_ARRAY = new Array(staticData.N).fill(0);

    const oldCart = window.DB_CART_QTY;
    window.DB_CART_QTY = new Int32Array(staticData.N);
    if (oldCart) {
        window.DB_CART_QTY.set(oldCart.subarray(0, Math.min(oldCart.length, staticData.N)));
    }
}

