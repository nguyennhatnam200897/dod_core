import { bootEngineWasm, Motherboard, STRING_ARENA, getDynamicString, getDbString } from '../runtime_v44.js';

// --- API KHỞI CHẠY ENGINE ---
export async function bootApp() {
    await bootEngineWasm();

    window.MB = Motherboard;
    window.STRING_ARENA = STRING_ARENA;
    window.getDynamicString = getDynamicString;
    window.getDbString = getDbString;
    console.log("✅ DOD Engine: Bo mạch chủ đã khởi động! (Zero-Allocation Mode)");
}
