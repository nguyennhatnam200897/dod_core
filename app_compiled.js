import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, DYNAMIC_STR, unplug, plug, Motherboard, initObjectPool, bootEngineWasm, Router } from './runtime_v44.js';

// --- COMPONENT: ShopManager ---
const createShopManager = (() => {
    const COUNTS = {"f64":0,"i32":0,"u8":1,"sinks":0,"totalNodes":0,"graphSize":0};
    const FINGERPRINT = [];
    const LUT = [""];
    const EVENTS = [];
    const SINKS = [];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    
    

    const BATCHES_C = [

];
    const BATCHES_R = [

];

    const EXPORTED_PORTS = {
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "ShopManager_" + instanceId : "ShopManager";
        
        const mem = allocMemory(COUNTS, "ShopManager");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([]); 
        I32.set([]); 
        U8.set([1]);
        GRAPH.set([]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
Motherboard.initVirtualScroll("ProductItem", "#product-grid", window.DB.ID, 140, (instanceMbId, rowData, rowIndex) => {
  Motherboard.sendSignal(instanceMbId, "ROW_INDEX", rowIndex);
});
Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {}, actions, 0);
        bindEvents(root, EVENTS, _mbId);

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
            actions.act_0();
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

// --- COMPONENT: ProductItem ---
const createProductItem = (() => {
    const COUNTS = {"f64":0,"i32":23,"u8":1,"sinks":8,"totalNodes":31,"graphSize":5};
    const FINGERPRINT = [{"idx":0,"type":"TRANSFORM_Y","selector":".virtual-wrapper"},{"idx":1,"type":"TEXT","selector":".product-name"},{"idx":2,"type":"TEXT","selector":".product-price"},{"idx":3,"type":"TEXT","selector":".product-stock"},{"idx":4,"type":"SHOW","selector":".badge-out","displayStyle":"block"},{"idx":5,"type":"SHOW","selector":".badge-low","displayStyle":"block"},{"idx":6,"type":"ATTR","selector":".btn-buy"},{"idx":7,"type":"CLASS","selector":".btn-buy","className":"btn-disabled"}];
    const LUT = [""," đ"];
    const EVENTS = [{"selector":".btn-buy","eventName":"click","actionName":"act_0","inputs":[]}];
    const SINKS = [1,4,6,10,13,19,20,21];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 268435456) { v = (setDynamicString(window.DB.NAME[I32[1]])) | 0; if (I32[2] !== v) {   if (v < 0) retainDynamicString(v);   if (I32[2] < 0) releaseDynamicString(I32[2]);   I32[2] = v; FLAGS_R[0] |= 134217728; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; }  } 
if (mask & 67108864) { v = ((window.DB.PACKED_DATA[I32[1]] & 16777215)) | 0; if (I32[3] !== v) {   I32[3] = v; FLAGS_R[0] |= 33554432; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; }  } 
if (mask & 16777216) { v = (((window.DB.PACKED_DATA[I32[1]] >> 24) & 255)) | 0; if (I32[4] !== v) {   I32[4] = v; FLAGS_C[0] |= 4194304; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 512; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
if (mask & 8388608) { v = (window.DB.CART_QTY[I32[1]]) | 0; if (I32[5] !== v) {   I32[5] = v; FLAGS_C[0] |= 4194304; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 512; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 2; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
if (mask & 4) { v = (window.DB.ID[I32[1]]) | 0; if (I32[21] !== v) {   I32[21] = v; }  } 
 };
    const r_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { const val = I32[0];
if (CACHE[0] !== val) { 
  if (CACHE[0] === null) {
    if (DOM[0].style.getPropertyValue('--y') !== val + "px") DOM[0].style.setProperty('--y', val + "px");
  } else { DOM[0].style.setProperty('--y', val + "px"); }
  CACHE[0] = val; 
} } 
if (mask & 134217728) { 
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
if (mask & 33554432) { 
                    const textVal = String(I32[3]) + (LUT[1] || LUT[0]);
                    if (CACHE[2] !== textVal) { 
                        if (CACHE[2] === null) {
                            if (DOM[2].textContent !== String(textVal)) DOM[2].textContent = textVal;
                        } else {
                            DOM[2].textContent = textVal;
                        }
                        CACHE[2] = textVal; 
                    }
                 } 
if (mask & 2097152) { 
                    const textVal = String(I32[6]);
                    if (CACHE[3] !== textVal) { 
                        if (CACHE[3] === null) {
                            if (DOM[3].textContent !== String(textVal)) DOM[3].textContent = textVal;
                        } else {
                            DOM[3].textContent = textVal;
                        }
                        CACHE[3] = textVal; 
                    }
                 } 
if (mask & 262144) { const val = I32[8];
if (CACHE[4] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[4] === null) {
    if (DOM[4].style.display !== targetStyle) DOM[4].style.display = targetStyle;
  } else {
    DOM[4].style.display = targetStyle;
  }
  CACHE[4] = val; 
} } 
if (mask & 4096) { const val = I32[13];
if (CACHE[5] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[5] === null) {
    if (DOM[5].style.display !== targetStyle) DOM[5].style.display = targetStyle;
  } else {
    DOM[5].style.display = targetStyle;
  }
  CACHE[5] = val; 
} } 
if (mask & 2048) { const val = I32[8];
if (CACHE[6] !== val) { 
  if (CACHE[6] === null) {
    const hasAttr = DOM[6].hasAttribute('disabled');
    if (val && !hasAttr) DOM[6].setAttribute('disabled', '');
    else if (!val && hasAttr) DOM[6].removeAttribute('disabled');
  } else {
    if (val) DOM[6].setAttribute('disabled', '');
    else DOM[6].removeAttribute('disabled');
  }
  CACHE[6] = val; 
} } 
if (mask & 1024) { const val = I32[8];
if (CACHE[7] !== val) { 
  if (CACHE[7] === null) {
    const hasClass = DOM[7].classList.contains("btn-disabled");
    if (val && !hasClass) DOM[7].classList.add("btn-disabled");
    else if (!val && hasClass) DOM[7].classList.remove("btn-disabled");
  } else {
    if (val) DOM[7].classList.add("btn-disabled");
    else DOM[7].classList.remove("btn-disabled");
  }
  CACHE[7] = val; 
} } 
 };

    const BATCHES_C = [
c_exec_0
];
    const BATCHES_R = [
r_exec_0
];

    const EXPORTED_PORTS = {
  "ROW_INDEX": { 
    id: 1, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; markBatch(FLAGS_C, L2_C, L1_C, GRAPH, 0, 5);  } 
  },
  "TRANSFORM_Y": { 
    id: 0, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648;  } 
  },
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "ProductItem_" + instanceId : "ProductItem";
        
        const mem = allocMemory(COUNTS, "ProductItem");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([]); 
        I32.set([0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,1,0,0,0,0,0,0,0]); 
        U8.set([1]);
        GRAPH.set([29,3,8,5,7]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
const _disp_0_arg_0 = (((((window.DB.CART_QTY[I32[1]]) < (((window.DB.PACKED_DATA[I32[1]] >> 24) & 255)) ? 1 : 0)) ? I32[15] : I32[16]));
const _disp_0_arg_1 = ((window.DB.PACKED_DATA[I32[1]] & 16777215));
const _disp_1_arg_0 = (((((((((window.DB.PACKED_DATA[I32[1]] >> 24) & 255)) - (window.DB.CART_QTY[I32[1]]))) - (((((window.DB.CART_QTY[I32[1]]) < (((window.DB.PACKED_DATA[I32[1]] >> 24) & 255)) ? 1 : 0)) ? I32[15] : I32[16])))) <= I32[19] ? 1 : 0));
const _disp_1_arg_1 = (setDynamicString(window.DB.NAME[I32[1]]));
const _disp_2_arg_0 = (window.DB.ID[I32[1]]);
const _disp_2_arg_1 = (((((window.DB.CART_QTY[I32[1]]) < (((window.DB.PACKED_DATA[I32[1]] >> 24) & 255)) ? 1 : 0)) ? I32[15] : I32[16]));
const _tempVal_4 = (((window.DB.CART_QTY[I32[1]]) + (((((window.DB.CART_QTY[I32[1]]) < (((window.DB.PACKED_DATA[I32[1]] >> 24) & 255)) ? 1 : 0)) ? I32[15] : I32[16]))));
I32[5] = (_tempVal_4) | 0;
FLAGS_C[0] |= 4194304; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 512; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 2; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; Motherboard.callAction("Cart", "ADD_ITEM_ACTION", _disp_0_arg_0, _disp_0_arg_1);
Motherboard.callAction("PopupModal", "TRIGGER_ACTION", _disp_1_arg_0, _disp_1_arg_1 >= 0 ? (LUT[_disp_1_arg_1] || LUT[0]) : DYNAMIC_STR[-(_disp_1_arg_1 + 1)]);
if (typeof window["syncCartData"] === 'function') window["syncCartData"](_disp_2_arg_0, _disp_2_arg_1);
Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {}, actions, 0);
        bindEvents(root, EVENTS, _mbId);

        for (let i = 0; i < COUNTS.totalNodes; i++) {
            const flagIdx = i >>> 5; const flagBit = 31 - (i & 31);
            const l2Idx = flagIdx >>> 5; const l2Bit = 31 - (flagIdx & 31);
            const l1Idx = l2Idx >>> 5; const l1Bit = 31 - (l2Idx & 31);
            FLAGS_C[flagIdx] |= (1 << flagBit); L2_C[l2Idx] |= (1 << l2Bit); L1_C[l1Idx] |= (1 << l1Bit);
            FLAGS_R[flagIdx] |= (1 << flagBit); L2_R[l2Idx] |= (1 << l2Bit); L1_R[l1Idx] |= (1 << l1Bit);
        }
        Motherboard.enqueue(_mbId);
        Motherboard.wakeUp();

        const STR_INDICES = [2];

        

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

// --- COMPONENT: Cart ---
const createCart = (() => {
    const COUNTS = {"f64":2,"i32":30,"u8":1,"sinks":7,"totalNodes":39,"graphSize":4};
    const FINGERPRINT = [{"idx":0,"type":"VALUE","selector":"#promo-input"},{"idx":1,"type":"TEXT","selector":"#cart-qty"},{"idx":2,"type":"TEXT","selector":"#cart-subtotal"},{"idx":3,"type":"TEXT","selector":"#cart-discount"},{"idx":4,"type":"TEXT","selector":"#cart-vat"},{"idx":5,"type":"TEXT","selector":"#cart-final"},{"idx":6,"type":"SHOW","selector":"#btn-checkout","displayStyle":"block"}];
    const LUT = ["","VIP2026","FREESHIP"," đ"];
    const EVENTS = [{"selector":"#promo-input","eventName":"input","actionName":"act_0","inputs":[{"path":["value"],"expectedType":"STR"}]}];
    const SINKS = [1,3,5,20,27,29,32];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 16777216) { v = (((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : DYNAMIC_STR[-(I32[0] + 1)]) === (I32[3] >= 0 ? (LUT[I32[3]] || LUT[0]) : DYNAMIC_STR[-(I32[3] + 1)]) ? 1 : 0)) | 0; if (I32[4] !== v) {   I32[4] = v; FLAGS_C[0] |= 8192; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
if (mask & 131072) { v = (((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : DYNAMIC_STR[-(I32[0] + 1)]) === (I32[9] >= 0 ? (LUT[I32[9]] || LUT[0]) : DYNAMIC_STR[-(I32[9] + 1)]) ? 1 : 0)) | 0; if (I32[10] !== v) {   I32[10] = v; FLAGS_C[0] |= 16384; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
 };
const c_exec_1 = null;
    const r_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { const val = String((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : DYNAMIC_STR[-(I32[0] + 1)]));
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
if (mask & 268435456) { 
                    const textVal = String(I32[1]);
                    if (CACHE[1] !== textVal) { 
                        if (CACHE[1] === null) {
                            if (DOM[1].textContent !== String(textVal)) DOM[1].textContent = textVal;
                        } else {
                            DOM[1].textContent = textVal;
                        }
                        CACHE[1] = textVal; 
                    }
                 } 
if (mask & 67108864) { 
                    const textVal = String(I32[2]) + (LUT[3] || LUT[0]);
                    if (CACHE[2] !== textVal) { 
                        if (CACHE[2] === null) {
                            if (DOM[2].textContent !== String(textVal)) DOM[2].textContent = textVal;
                        } else {
                            DOM[2].textContent = textVal;
                        }
                        CACHE[2] = textVal; 
                    }
                 } 
if (mask & 2048) { 
                    const textVal = String(I32[15]) + (LUT[3] || LUT[0]);
                    if (CACHE[3] !== textVal) { 
                        if (CACHE[3] === null) {
                            if (DOM[3].textContent !== String(textVal)) DOM[3].textContent = textVal;
                        } else {
                            DOM[3].textContent = textVal;
                        }
                        CACHE[3] = textVal; 
                    }
                 } 
if (mask & 16) { 
                    const textVal = String(I32[20]) + (LUT[3] || LUT[0]);
                    if (CACHE[4] !== textVal) { 
                        if (CACHE[4] === null) {
                            if (DOM[4].textContent !== String(textVal)) DOM[4].textContent = textVal;
                        } else {
                            DOM[4].textContent = textVal;
                        }
                        CACHE[4] = textVal; 
                    }
                 } 
if (mask & 4) { 
                    const textVal = String(I32[21]) + (LUT[3] || LUT[0]);
                    if (CACHE[5] !== textVal) { 
                        if (CACHE[5] === null) {
                            if (DOM[5].textContent !== String(textVal)) DOM[5].textContent = textVal;
                        } else {
                            DOM[5].textContent = textVal;
                        }
                        CACHE[5] = textVal; 
                    }
                 } 
 };
const r_exec_1 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & -2147483648) { const val = I32[23];
if (CACHE[6] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[6] === null) {
    if (DOM[6].style.display !== targetStyle) DOM[6].style.display = targetStyle;
  } else {
    DOM[6].style.display = targetStyle;
  }
  CACHE[6] = val; 
} } 
 };

    const BATCHES_C = [
c_exec_0, c_exec_1
];
    const BATCHES_R = [
r_exec_0, r_exec_1
];

    const EXPORTED_PORTS = {
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "Cart_" + instanceId : "Cart";
        
        const mem = allocMemory(COUNTS, "Cart");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([0,0]); 
        I32.set([0,0,0,1,0,20,0,100,0,2,0,30000,0,0,0,0,0,8,0,100,0,0,0,0,0,0,0,0,0,0]); 
        U8.set([1]);
        GRAPH.set([9,19,21,38]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: (newVal) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
const _newVal_newVal = setDynamicString(newVal);
if (I32[24] !== _newVal_newVal) {
  if (I32[24] < 0) releaseDynamicString(I32[24]);
  I32[24] = _newVal_newVal;
} else {
  if (_newVal_newVal < 0) releaseDynamicString(_newVal_newVal);
}
const _tempVal_2 = I32[24];
if (_tempVal_2 < 0) retainDynamicString(_tempVal_2);
if (I32[0] < 0) releaseDynamicString(I32[0]);
I32[0] = _tempVal_2;
FLAGS_C[0] |= 16777216; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 131072; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); },
    act_1: (qty, price) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
I32[25] = qty;
FLAGS_C[1] |= 134217728; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[1] |= 67108864; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; I32[26] = price;
FLAGS_C[1] |= 67108864; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; const _tempVal_0 = ((I32[1] + I32[25]));
I32[1] = (_tempVal_0) | 0;
FLAGS_C[0] |= 1; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[1] |= 134217728; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_R[0] |= 268435456; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; const _tempVal_1 = ((I32[2] + ((I32[25] * I32[26]))));
I32[2] = (_tempVal_1) | 0;
markBatch(FLAGS_C, L2_C, L1_C, GRAPH, 0, 4); FLAGS_R[0] |= 67108864; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {"ADD_ITEM_ACTION":"act_1"}, actions, 0);
        bindEvents(root, EVENTS, _mbId);

        for (let i = 0; i < COUNTS.totalNodes; i++) {
            const flagIdx = i >>> 5; const flagBit = 31 - (i & 31);
            const l2Idx = flagIdx >>> 5; const l2Bit = 31 - (flagIdx & 31);
            const l1Idx = l2Idx >>> 5; const l1Bit = 31 - (l2Idx & 31);
            FLAGS_C[flagIdx] |= (1 << flagBit); L2_C[l2Idx] |= (1 << l2Bit); L1_C[l1Idx] |= (1 << l1Bit);
            FLAGS_R[flagIdx] |= (1 << flagBit); L2_R[l2Idx] |= (1 << l2Bit); L1_R[l1Idx] |= (1 << l1Bit);
        }
        Motherboard.enqueue(_mbId);
        Motherboard.wakeUp();

        const STR_INDICES = [0,3,9,24];

        

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

// --- COMPONENT: PopupModal ---
const createPopupModal = (() => {
    const COUNTS = {"f64":0,"i32":8,"u8":1,"sinks":2,"totalNodes":10,"graphSize":0};
    const FINGERPRINT = [{"idx":0,"type":"SHOW","selector":".modal-overlay","displayStyle":"flex"},{"idx":1,"type":"TEXT","selector":"#modal-msg"}];
    const LUT = ["","Bạn không thể thêm "," nữa vì đã hết hàng trong kho."];
    const EVENTS = [{"selector":".btn-close-modal","eventName":"click","actionName":"act_1","inputs":[]}];
    const SINKS = [1,3];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = null;
    const r_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { const val = I32[0];
if (CACHE[0] !== val) { 
  const targetStyle = val ? "flex" : "none";
  if (CACHE[0] === null) {
    if (DOM[0].style.display !== targetStyle) DOM[0].style.display = targetStyle;
  } else {
    DOM[0].style.display = targetStyle;
  }
  CACHE[0] = val; 
} } 
if (mask & 268435456) { 
                    const textVal = (LUT[1] || LUT[0]) + (I32[1] >= 0 ? (LUT[I32[1]] || LUT[0]) : DYNAMIC_STR[-(I32[1] + 1)]) + (LUT[2] || LUT[0]);
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
        const finalName = instanceId !== "" ? "PopupModal_" + instanceId : "PopupModal";
        
        const mem = allocMemory(COUNTS, "PopupModal");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([]); 
        I32.set([0,0,0,0,1,0,0,0]); 
        U8.set([1]);
        GRAPH.set([]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: (shouldOpen, productName) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
I32[2] = shouldOpen;
FLAGS_C[0] |= 16777216; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 8388608; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; const _newVal_productName = setDynamicString(productName);
if (I32[3] !== _newVal_productName) {
  if (I32[3] < 0) releaseDynamicString(I32[3]);
  I32[3] = _newVal_productName;
} else {
  if (_newVal_productName < 0) releaseDynamicString(_newVal_productName);
}
FLAGS_C[0] |= 8388608; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; const _tempVal_0 = ((I32[2] ? I32[4] : I32[0]));
I32[0] = (_tempVal_0) | 0;
FLAGS_C[0] |= 16777216; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; const _tempVal_1 = ((I32[2] ? I32[3] : I32[1]));
if (_tempVal_1 < 0) retainDynamicString(_tempVal_1);
if (I32[1] < 0) releaseDynamicString(I32[1]);
I32[1] = _tempVal_1;
FLAGS_C[0] |= 8388608; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 268435456; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); },
    act_1: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
const _tempVal_0 = I32[7];
I32[0] = (_tempVal_0) | 0;
FLAGS_C[0] |= 16777216; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {"TRIGGER_ACTION":"act_0"}, actions, 0);
        bindEvents(root, EVENTS, _mbId);

        for (let i = 0; i < COUNTS.totalNodes; i++) {
            const flagIdx = i >>> 5; const flagBit = 31 - (i & 31);
            const l2Idx = flagIdx >>> 5; const l2Bit = 31 - (flagIdx & 31);
            const l1Idx = l2Idx >>> 5; const l1Bit = 31 - (l2Idx & 31);
            FLAGS_C[flagIdx] |= (1 << flagBit); L2_C[l2Idx] |= (1 << l2Bit); L1_C[l1Idx] |= (1 << l1Bit);
            FLAGS_R[flagIdx] |= (1 << flagBit); L2_R[l2Idx] |= (1 << l2Bit); L1_R[l1Idx] |= (1 << l1Bit);
        }
        Motherboard.enqueue(_mbId);
        Motherboard.wakeUp();

        const STR_INDICES = [1,3,6];

        

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

// --- KHỞI CHẠY HỆ THỐNG ---
async function startApp() {
    await bootEngineWasm();

    window.mountComponents = () => {
        if (document.querySelector('body')) createShopManager(document.querySelector('body'));
        if (document.querySelector('#product-grid')) initObjectPool('ProductItem', createProductItem, '#product-grid', 20);
        if (document.querySelector('#cart-widget')) createCart(document.querySelector('#cart-widget'));
        Motherboard.registerLazy('PopupModal', createPopupModal, '#modal-tpl', '#modal-container');
    };

    window.MB = Motherboard;
    window.DSTR = DYNAMIC_STR;
    console.log("✅ Bo mạch chủ đã khởi động! Mọi Component đã sẵn sàng.");
    window.mountComponents();
    Router.init('#app-root', window.mountComponents);
}

startApp();
