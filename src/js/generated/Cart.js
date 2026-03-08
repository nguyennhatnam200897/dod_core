import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, unplug, plug, Motherboard, getDynamicString } from '../runtime_v44.js';

// --- COMPONENT: Cart ---
const createCart = (() => {
    const COUNTS = {"f64":5,"i32":31,"u8":1,"sinks":8,"totalNodes":44,"graphSize":8};
    const FINGERPRINT = [{"idx":0,"type":"VALUE","selector":"#promo-input"},{"idx":1,"type":"TEXT","selector":"#cart-qty"},{"idx":2,"type":"TEXT","selector":"#global-cart-qty"},{"idx":3,"type":"TEXT","selector":"#cart-subtotal"},{"idx":4,"type":"TEXT","selector":"#cart-discount"},{"idx":5,"type":"TEXT","selector":"#cart-vat"},{"idx":6,"type":"TEXT","selector":"#cart-final"},{"idx":7,"type":"SHOW","selector":"#btn-checkout","displayStyle":"block"}];
    const LUT = ["","VIP2026","FREESHIP"," đ"];
    const EVENTS = [{"selector":"#promo-input","eventName":"input","actionName":"act_0","inputs":[{"path":["value"],"expectedType":"STR"}]}];
    const SINKS = [1,3,4,6,21,28,30,33];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 8388608) { v = (((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : getDynamicString(I32[0])) === (I32[3] >= 0 ? (LUT[I32[3]] || LUT[0]) : getDynamicString(I32[3])) ? 1 : 0)) | 0; if (I32[4] !== v) {   I32[4] = v; FLAGS_C[0] |= 4096; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
if (mask & 65536) { v = (((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : getDynamicString(I32[0])) === (I32[9] >= 0 ? (LUT[I32[9]] || LUT[0]) : getDynamicString(I32[9])) ? 1 : 0)) | 0; if (I32[10] !== v) {   I32[10] = v; FLAGS_C[0] |= 8192; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
 };
const c_exec_1 = null;
    const r_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { const val = String((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : getDynamicString(I32[0])));
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
if (mask & 134217728) { 
                    const textVal = String(I32[1]);
                    if (CACHE[2] !== textVal) { 
                        if (CACHE[2] === null) {
                            if (DOM[2].textContent !== String(textVal)) DOM[2].textContent = textVal;
                        } else {
                            DOM[2].textContent = textVal;
                        }
                        CACHE[2] = textVal; 
                    }
                 } 
if (mask & 33554432) { 
                    const textVal = String(I32[2]) + (LUT[3] || LUT[0]);
                    if (CACHE[3] !== textVal) { 
                        if (CACHE[3] === null) {
                            if (DOM[3].textContent !== String(textVal)) DOM[3].textContent = textVal;
                        } else {
                            DOM[3].textContent = textVal;
                        }
                        CACHE[3] = textVal; 
                    }
                 } 
if (mask & 1024) { 
                    const textVal = String(I32[15]) + (LUT[3] || LUT[0]);
                    if (CACHE[4] !== textVal) { 
                        if (CACHE[4] === null) {
                            if (DOM[4].textContent !== String(textVal)) DOM[4].textContent = textVal;
                        } else {
                            DOM[4].textContent = textVal;
                        }
                        CACHE[4] = textVal; 
                    }
                 } 
if (mask & 8) { 
                    const textVal = String(I32[20]) + (LUT[3] || LUT[0]);
                    if (CACHE[5] !== textVal) { 
                        if (CACHE[5] === null) {
                            if (DOM[5].textContent !== String(textVal)) DOM[5].textContent = textVal;
                        } else {
                            DOM[5].textContent = textVal;
                        }
                        CACHE[5] = textVal; 
                    }
                 } 
if (mask & 2) { 
                    const textVal = String(I32[21]) + (LUT[3] || LUT[0]);
                    if (CACHE[6] !== textVal) { 
                        if (CACHE[6] === null) {
                            if (DOM[6].textContent !== String(textVal)) DOM[6].textContent = textVal;
                        } else {
                            DOM[6].textContent = textVal;
                        }
                        CACHE[6] = textVal; 
                    }
                 } 
 };
const r_exec_1 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { const val = I32[23];
if (CACHE[7] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[7] === null) {
    if (DOM[7].style.display !== targetStyle) DOM[7].style.display = targetStyle;
  } else {
    DOM[7].style.display = targetStyle;
  }
  CACHE[7] = val; 
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
        
        F64.set([0,0,0,0,0]); 
        I32.set([0,0,0,1,0,20,0,100,0,2,0,30000,0,0,0,0,0,8,0,100,0,0,0,0,0,0,0,0,0,0,0]); 
        U8.set([1]);
        GRAPH.set([10,20,22,41,10,20,22,41]);

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
FLAGS_C[0] |= 8388608; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 65536; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); },
    act_1: (qty, price) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
I32[25] = qty;
FLAGS_C[1] |= 67108864; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[1] |= 33554432; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; F64[2] = price;
FLAGS_C[1] |= 16777216; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; const _tempVal_0 = ((I32[1] + I32[25]));
I32[1] = (_tempVal_0) | 0;
FLAGS_C[1] |= -2147483648; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[1] |= 67108864; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_R[0] |= 268435456; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; FLAGS_R[0] |= 134217728; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; const _tempVal_1 = ((I32[2] + ((((I32[25]) * F64[2])))));
I32[2] = (_tempVal_1) | 0;
markBatch(FLAGS_C, L2_C, L1_C, GRAPH, 0, 4); FLAGS_R[0] |= 33554432; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); },
    act_2: (totalQ, totalS) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
I32[29] = totalQ;
I32[30] = totalS;
const _tempVal_0 = I32[29];
I32[1] = (_tempVal_0) | 0;
FLAGS_C[1] |= -2147483648; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_C[1] |= 67108864; L2_C[0] |= 1073741824; L1_C[0] |= -2147483648; FLAGS_R[0] |= 268435456; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; FLAGS_R[0] |= 134217728; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; const _tempVal_1 = I32[30];
I32[2] = (_tempVal_1) | 0;
markBatch(FLAGS_C, L2_C, L1_C, GRAPH, 4, 8); FLAGS_R[0] |= 33554432; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); }
        });

        const _mbId = Motherboard.register(finalName, mem, BATCHES_C, BATCHES_R, EXPORTED_PORTS, {"ADD_ITEM_ACTION":"act_1","SYNC_CART_ACTION":"act_2"}, actions, 0);
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
export default createCart;
