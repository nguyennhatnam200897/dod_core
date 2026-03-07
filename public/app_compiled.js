import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, DYNAMIC_STR, unplug, plug, Motherboard, initObjectPool, bootEngineWasm, Router } from '../runtime_v44.js';

// --- COMPONENT: ShopCard ---
const createShopCard = (() => {
    const COUNTS = {"f64":9,"i32":24,"u8":1,"sinks":16,"totalNodes":49,"graphSize":4};
    const FINGERPRINT = [{"idx":0,"type":"SHOW","selector":0,"displayStyle":"block"},{"idx":1,"type":"TEXT","selector":1},{"idx":2,"type":"CLASS","selector":2,"className":"bg-green-100"},{"idx":3,"type":"CLASS","selector":2,"className":"text-green-700"},{"idx":4,"type":"CLASS","selector":2,"className":"border-green-200"},{"idx":5,"type":"CLASS","selector":2,"className":"bg-red-100"},{"idx":6,"type":"CLASS","selector":2,"className":"text-red-700"},{"idx":7,"type":"CLASS","selector":2,"className":"border-red-200"},{"idx":8,"type":"CLASS","selector":2,"className":"bg-gray-100"},{"idx":9,"type":"CLASS","selector":2,"className":"text-gray-700"},{"idx":10,"type":"CLASS","selector":2,"className":"border-gray-200"},{"idx":11,"type":"TEXT","selector":3},{"idx":12,"type":"TEXT","selector":4},{"idx":13,"type":"SHOW","selector":5,"displayStyle":"block"},{"idx":14,"type":"SHOW","selector":6,"displayStyle":"block"},{"idx":15,"type":"TEXT","selector":8}];
    const LUT = ["","Mở Modal tải hàng ngàn review chi tiết của Shop này!"];
    const EVENTS = [{"selector":9,"eventName":"click","actionName":"act_0","inputs":[]}];
    const SINKS = [4,6,10,11,12,16,17,18,22,23,24,25,27,34,38,47];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { v = +(window.DB.TRUST_SCORE[I32[0]]); if (F64[0] !== v) {   F64[0] = v; FLAGS_C[0] |= 4194304; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 65536; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 268435456; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 64; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; }  } 
if (mask & 67108864) { v = (setDynamicString(window.DB.NAME[I32[0]])) | 0; if (I32[2] !== v) {   if (v < 0) retainDynamicString(v);   if (I32[2] < 0) releaseDynamicString(I32[2]);   I32[2] = v; FLAGS_R[0] |= 33554432; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; }  } 
if (mask & 32) { v = (window.DB.TOTAL_REVIEWS[I32[0]]) | 0; if (I32[10] !== v) {   I32[10] = v; FLAGS_C[1] |= 2097152; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[1] |= 1073741824; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[1] |= 134217728; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_R[0] |= 16; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; }  } 
if (mask & 8) { v = (window.DB.PACKED_STATS[I32[0]]) | 0; if (I32[11] !== v) {   I32[11] = v; FLAGS_C[1] |= 8388608; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[0] |= 2; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
 };
const c_exec_1 = null;
    const r_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 134217728) { const val = I32[1];
if (CACHE[0] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[0] === null) {
    if (DOM[0].style.display !== targetStyle) DOM[0].style.display = targetStyle;
  } else {
    DOM[0].style.display = targetStyle;
  }
  CACHE[0] = val; 
} } 
if (mask & 33554432) { 
                    const textVal = (I32[2] >= 0 ? (LUT[I32[2]] || LUT[0]) : DYNAMIC_STR[-(I32[2] + 1)]);
                    if (CACHE[1] !== textVal) { 
                        if (CACHE[1] === null) {
                            if (DOM[1].textContent !== String(textVal)) DOM[1].textContent = textVal;
                        } else {
                            DOM[1].textContent = textVal;
                        }
                        CACHE[1] = textVal; 
                    }
                 } 
if (mask & 2097152) { const val = I32[4];
if (CACHE[2] !== val) { 
  if (CACHE[2] === null) {
    const hasClass = DOM[2].classList.contains("bg-green-100");
    if (val && !hasClass) DOM[2].classList.add("bg-green-100");
    else if (!val && hasClass) DOM[2].classList.remove("bg-green-100");
  } else {
    if (val) DOM[2].classList.add("bg-green-100");
    else DOM[2].classList.remove("bg-green-100");
  }
  CACHE[2] = val; 
} } 
if (mask & 1048576) { const val = I32[4];
if (CACHE[3] !== val) { 
  if (CACHE[3] === null) {
    const hasClass = DOM[3].classList.contains("text-green-700");
    if (val && !hasClass) DOM[3].classList.add("text-green-700");
    else if (!val && hasClass) DOM[3].classList.remove("text-green-700");
  } else {
    if (val) DOM[3].classList.add("text-green-700");
    else DOM[3].classList.remove("text-green-700");
  }
  CACHE[3] = val; 
} } 
if (mask & 524288) { const val = I32[4];
if (CACHE[4] !== val) { 
  if (CACHE[4] === null) {
    const hasClass = DOM[4].classList.contains("border-green-200");
    if (val && !hasClass) DOM[4].classList.add("border-green-200");
    else if (!val && hasClass) DOM[4].classList.remove("border-green-200");
  } else {
    if (val) DOM[4].classList.add("border-green-200");
    else DOM[4].classList.remove("border-green-200");
  }
  CACHE[4] = val; 
} } 
if (mask & 32768) { const val = I32[6];
if (CACHE[5] !== val) { 
  if (CACHE[5] === null) {
    const hasClass = DOM[5].classList.contains("bg-red-100");
    if (val && !hasClass) DOM[5].classList.add("bg-red-100");
    else if (!val && hasClass) DOM[5].classList.remove("bg-red-100");
  } else {
    if (val) DOM[5].classList.add("bg-red-100");
    else DOM[5].classList.remove("bg-red-100");
  }
  CACHE[5] = val; 
} } 
if (mask & 16384) { const val = I32[6];
if (CACHE[6] !== val) { 
  if (CACHE[6] === null) {
    const hasClass = DOM[6].classList.contains("text-red-700");
    if (val && !hasClass) DOM[6].classList.add("text-red-700");
    else if (!val && hasClass) DOM[6].classList.remove("text-red-700");
  } else {
    if (val) DOM[6].classList.add("text-red-700");
    else DOM[6].classList.remove("text-red-700");
  }
  CACHE[6] = val; 
} } 
if (mask & 8192) { const val = I32[6];
if (CACHE[7] !== val) { 
  if (CACHE[7] === null) {
    const hasClass = DOM[7].classList.contains("border-red-200");
    if (val && !hasClass) DOM[7].classList.add("border-red-200");
    else if (!val && hasClass) DOM[7].classList.remove("border-red-200");
  } else {
    if (val) DOM[7].classList.add("border-red-200");
    else DOM[7].classList.remove("border-red-200");
  }
  CACHE[7] = val; 
} } 
if (mask & 512) { const val = I32[9];
if (CACHE[8] !== val) { 
  if (CACHE[8] === null) {
    const hasClass = DOM[8].classList.contains("bg-gray-100");
    if (val && !hasClass) DOM[8].classList.add("bg-gray-100");
    else if (!val && hasClass) DOM[8].classList.remove("bg-gray-100");
  } else {
    if (val) DOM[8].classList.add("bg-gray-100");
    else DOM[8].classList.remove("bg-gray-100");
  }
  CACHE[8] = val; 
} } 
if (mask & 256) { const val = I32[9];
if (CACHE[9] !== val) { 
  if (CACHE[9] === null) {
    const hasClass = DOM[9].classList.contains("text-gray-700");
    if (val && !hasClass) DOM[9].classList.add("text-gray-700");
    else if (!val && hasClass) DOM[9].classList.remove("text-gray-700");
  } else {
    if (val) DOM[9].classList.add("text-gray-700");
    else DOM[9].classList.remove("text-gray-700");
  }
  CACHE[9] = val; 
} } 
if (mask & 128) { const val = I32[9];
if (CACHE[10] !== val) { 
  if (CACHE[10] === null) {
    const hasClass = DOM[10].classList.contains("border-gray-200");
    if (val && !hasClass) DOM[10].classList.add("border-gray-200");
    else if (!val && hasClass) DOM[10].classList.remove("border-gray-200");
  } else {
    if (val) DOM[10].classList.add("border-gray-200");
    else DOM[10].classList.remove("border-gray-200");
  }
  CACHE[10] = val; 
} } 
if (mask & 64) { 
                    const textVal = String(F64[0]);
                    if (CACHE[11] !== textVal) { 
                        if (CACHE[11] === null) {
                            if (DOM[11].textContent !== String(textVal)) DOM[11].textContent = textVal;
                        } else {
                            DOM[11].textContent = textVal;
                        }
                        CACHE[11] = textVal; 
                    }
                 } 
if (mask & 16) { 
                    const textVal = String(I32[10]);
                    if (CACHE[12] !== textVal) { 
                        if (CACHE[12] === null) {
                            if (DOM[12].textContent !== String(textVal)) DOM[12].textContent = textVal;
                        } else {
                            DOM[12].textContent = textVal;
                        }
                        CACHE[12] = textVal; 
                    }
                 } 
 };
const r_exec_1 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 536870912) { const val = I32[16];
if (CACHE[13] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[13] === null) {
    if (DOM[13].style.display !== targetStyle) DOM[13].style.display = targetStyle;
  } else {
    DOM[13].style.display = targetStyle;
  }
  CACHE[13] = val; 
} } 
if (mask & 33554432) { const val = I32[19];
if (CACHE[14] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[14] === null) {
    if (DOM[14].style.display !== targetStyle) DOM[14].style.display = targetStyle;
  } else {
    DOM[14].style.display = targetStyle;
  }
  CACHE[14] = val; 
} } 
if (mask & 65536) { 
                    const textVal = String(F64[8]);
                    if (CACHE[15] !== textVal) { 
                        if (CACHE[15] === null) {
                            if (DOM[15].textContent !== String(textVal)) DOM[15].textContent = textVal;
                        } else {
                            DOM[15].textContent = textVal;
                        }
                        CACHE[15] = textVal; 
                    }
                 } 
 };

    const BATCHES_C = [
c_exec_0, c_exec_1
];
    const BATCHES_R = [
r_exec_0, r_exec_1
];

    const EXPORTED_PORTS = {
  "ROW_INDEX": { 
    id: 0, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; markBatch(FLAGS_C, L2_C, L1_C, GRAPH, 0, 4);  } 
  },
  "MIN_SCORE": { 
    id: 1, 
    type: "F64", 
    semantic: "F64", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_C[0] |= 268435456; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648;  } 
  },
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "ShopCard_" + instanceId : "ShopCard";
        
        const mem = allocMemory(COUNTS, "ShopCard");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([0,0,0,0,0,0,0,0,0]); 
        I32.set([-1,0,0,8,0,5,0,0,0,0,0,0,16,0,5,0,0,5000,0,0,65535,0,100,1]); 
        U8.set([1]);
        GRAPH.set([5,1,26,28]);

        // Bắt lấy mảng DOM
        const dynamicNodes = hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
const _disp_0_arg_0 = I32[23];
if (typeof window["alert"] === 'function') window["alert"](_disp_0_arg_0 >= 0 ? (LUT[_disp_0_arg_0] || LUT[0]) : DYNAMIC_STR[-(_disp_0_arg_0 + 1)]);
Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {}, actions, 0);
        
        // Truyền mảng DOM vào
        bindEvents(root, EVENTS, _mbId, dynamicNodes);

        for (let i = 0; i < COUNTS.totalNodes; i++) {
            const flagIdx = i >>> 5; const flagBit = 31 - (i & 31);
            const l2Idx = flagIdx >>> 5; const l2Bit = 31 - (flagIdx & 31);
            const l1Idx = l2Idx >>> 5; const l1Bit = 31 - (l2Idx & 31);
            FLAGS_C[flagIdx] |= (1 << flagBit); L2_C[l2Idx] |= (1 << l2Bit); L1_C[l1Idx] |= (1 << l1Bit);
            FLAGS_R[flagIdx] |= (1 << flagBit); L2_R[l2Idx] |= (1 << l2Bit); L1_R[l1Idx] |= (1 << l1Bit);
        }
        Motherboard.enqueue(_mbId);
        Motherboard.wakeUp();

        const STR_INDICES = [2,23];

        

        return {
            plug: () => plug(root, mem, 0, FLAGS_R, L2_R, L1_R, SINKS),
            unplug: () => { unplug(root, mem, 0); },
            detach: () => {
                unplug(root, mem, 0);
                root.__parent = root.parentNode; root.__nextSibling = root.nextSibling;
                if (root.parentNode) root.remove(); 
            },
            restore: () => {
                if (root.__parent) root.__parent.insertBefore(root, root.__nextSibling); 
                plug(root, mem, 0, FLAGS_R, L2_R, L1_R, SINKS); 
            },
            recycle: () => {
                unplug(root, mem, 0); 
                for (let i = 0; i < STR_INDICES.length; i++) {
                    const strId = mem.I32[STR_INDICES[i]];
                    if (strId < 0) { releaseDynamicString(strId); mem.I32[STR_INDICES[i]] = 0; }
                }
            },
            _mbId, _poolId: instanceId !== "" ? instanceId : -1, _name: finalName, _dataIndex: -2, _rootNode: root
        };
    }
})();

// --- COMPONENT: PlatformManager ---
const createPlatformManager = (() => {
    const COUNTS = {"f64":3,"i32":0,"u8":1,"sinks":2,"totalNodes":5,"graphSize":0};
    const FINGERPRINT = [{"idx":0,"type":"VALUE","selector":"#score-slider"},{"idx":1,"type":"TEXT","selector":"#min-score-lbl"}];
    const LUT = [""];
    const EVENTS = [{"selector":"#score-slider","eventName":"input","actionName":"act_0","inputs":[{"path":["value"],"expectedType":"F64"}]},{"selector":"#score-slider","eventName":"input","actionName":"act_2","inputs":[{"path":["value"],"expectedType":"F64"}]}];
    const SINKS = [1,2];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = null;
    const r_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { const val = String(F64[0]);
if (CACHE[0] !== val) { 
  // CHỈ GHI ĐÈ NẾU DOM THỰC SỰ KHÁC BIỆT (Tránh chớp nháy input)
  if (DOM[0].value !== val) {
    const active = document.activeElement === DOM[0];
    let start = 0, end = 0;
    // BƯỚC 1: Lưu vị trí con trỏ nếu user đang gõ
    if (active) { start = DOM[0].selectionStart; end = DOM[0].selectionEnd; }
    
    DOM[0].value = val;
    
    // BƯỚC 2: Trả con trỏ về vị trí cũ
    if (active) DOM[0].setSelectionRange(start, end);
  }
  CACHE[0] = val; 
} } 
if (mask & 536870912) { 
                    const textVal = String(F64[0]);
                    if (CACHE[1] !== textVal) { 
                        if (CACHE[1] === null) {
                            if (DOM[1].textContent !== String(textVal)) DOM[1].textContent = textVal;
                        } else {
                            DOM[1].textContent = textVal;
                        }
                        CACHE[1] = textVal; 
                    }
                 } 
 };

    const BATCHES_C = [
c_exec_0
];
    const BATCHES_R = [
r_exec_0
];

    const EXPORTED_PORTS = {
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "PlatformManager_" + instanceId : "PlatformManager";
        
        const mem = allocMemory(COUNTS, "PlatformManager");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([0,0,0]); 
        I32.set([]); 
        U8.set([1]);
        GRAPH.set([]);

        // Bắt lấy mảng DOM
        const dynamicNodes = hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: (newVal) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
F64[1] = newVal;
const _tempVal_0 = F64[1];
F64[0] = +_tempVal_0;
FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; FLAGS_R[0] |= 536870912; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); },
    act_1: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
Motherboard.initVirtualScroll("ShopCard", "#shop-grid", window.DB.NAME, 180, (instanceMbId, rowData, rowIndex) => {
  Motherboard.sendSignal(instanceMbId, "ROW_INDEX", rowIndex);
});
Motherboard.wakeUp(); },
    act_2: (newVal) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
F64[2] = newVal;
const _disp_0_arg_0 = F64[2];
const _tempVal_0 = F64[2];
F64[0] = +_tempVal_0;
FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; FLAGS_R[0] |= 536870912; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; if (typeof window["broadcastMinScore"] === 'function') window["broadcastMinScore"](_disp_0_arg_0);
Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {}, actions, 0);
        
        // Truyền mảng DOM vào
        bindEvents(root, EVENTS, _mbId, dynamicNodes);

        for (let i = 0; i < COUNTS.totalNodes; i++) {
            const flagIdx = i >>> 5; const flagBit = 31 - (i & 31);
            const l2Idx = flagIdx >>> 5; const l2Bit = 31 - (flagIdx & 31);
            const l1Idx = l2Idx >>> 5; const l1Bit = 31 - (l2Idx & 31);
            FLAGS_C[flagIdx] |= (1 << flagBit); L2_C[l2Idx] |= (1 << l2Bit); L1_C[l1Idx] |= (1 << l1Bit);
            FLAGS_R[flagIdx] |= (1 << flagBit); L2_R[l2Idx] |= (1 << l2Bit); L1_R[l1Idx] |= (1 << l1Bit);
        }
        Motherboard.enqueue(_mbId);
        Motherboard.wakeUp();

        const STR_INDICES = [];

        setTimeout(() => {
            actions.act_1();
            Motherboard.enqueue(_mbId);
            Motherboard.wakeUp();
        }, 0);

        return {
            plug: () => plug(root, mem, 0, FLAGS_R, L2_R, L1_R, SINKS),
            unplug: () => { unplug(root, mem, 0); },
            detach: () => {
                unplug(root, mem, 0);
                root.__parent = root.parentNode; root.__nextSibling = root.nextSibling;
                if (root.parentNode) root.remove(); 
            },
            restore: () => {
                if (root.__parent) root.__parent.insertBefore(root, root.__nextSibling); 
                plug(root, mem, 0, FLAGS_R, L2_R, L1_R, SINKS); 
            },
            recycle: () => {
                unplug(root, mem, 0); 
                for (let i = 0; i < STR_INDICES.length; i++) {
                    const strId = mem.I32[STR_INDICES[i]];
                    if (strId < 0) { releaseDynamicString(strId); mem.I32[STR_INDICES[i]] = 0; }
                }
            },
            _mbId, _poolId: instanceId !== "" ? instanceId : -1, _name: finalName, _dataIndex: -2, _rootNode: root
        };
    }
})();

async function startApp() {
    await bootEngineWasm();
    window.mountComponents = () => {
        if (document.querySelector('#card-pool')) initObjectPool('ShopCard', createShopCard, '#card-pool', 20);
        if (document.querySelector('#dod-attach-platformmanager')) { const inst = createPlatformManager(document.querySelector('#dod-attach-platformmanager')); inst.plug(); }
    };
    window.MB = Motherboard;
    window.DSTR = DYNAMIC_STR;
    window.mountComponents();
}
startApp();
