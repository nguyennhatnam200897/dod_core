import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, unplug, plug, Motherboard, getDynamicString } from '../runtime_v44.js';

// --- COMPONENT: Cart ---
const createCart = (() => {
    const COUNTS = {"f64":19,"i32":10,"u8":1,"sinks":7,"totalNodes":36,"graphSize":4};
    const FINGERPRINT = [{"idx":0,"type":"VALUE","selector":"#promo-input"},{"idx":1,"type":"TEXT","selector":"#cart-qty"},{"idx":2,"type":"TEXT","selector":"#cart-subtotal"},{"idx":3,"type":"TEXT","selector":"#cart-discount"},{"idx":4,"type":"TEXT","selector":"#cart-vat"},{"idx":5,"type":"TEXT","selector":"#cart-final"},{"idx":6,"type":"SHOW","selector":"#btn-checkout","displayStyle":"block"}];
    const LUT = ["","VIP2026","FREESHIP"];
    const EVENTS = [{"selector":"#promo-input","eventName":"input","actionName":"act_0","inputs":[{"path":["value"],"expectedType":"STR"}]}];
    const SINKS = [1,3,5,27,31,33,34];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 4194304) { v = (((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : getDynamicString(I32[0])) === (I32[2] >= 0 ? (LUT[I32[2]] || LUT[0]) : getDynamicString(I32[2])) ? 1 : 0)) | 0; if (I32[3] !== v) {   I32[3] = v; FLAGS_C[0] |= 2097152; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
if (mask & 65536) { v = (((I32[0] >= 0 ? (LUT[I32[0]] || LUT[0]) : getDynamicString(I32[0])) === (I32[5] >= 0 ? (LUT[I32[5]] || LUT[0]) : getDynamicString(I32[5])) ? 1 : 0)) | 0; if (I32[6] !== v) {   I32[6] = v; FLAGS_C[0] |= 32768; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; }  } 
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
if (mask & 67108864) { 
                    const textVal = String(F64[0]);
                    if (CACHE[2] !== textVal) { 
                        if (CACHE[2] === null) {
                            if (DOM[2].textContent !== String(textVal)) DOM[2].textContent = textVal;
                        } else {
                            DOM[2].textContent = textVal;
                        }
                        CACHE[2] = textVal; 
                    }
                 } 
if (mask & 16) { 
                    const textVal = String(F64[14]);
                    if (CACHE[3] !== textVal) { 
                        if (CACHE[3] === null) {
                            if (DOM[3].textContent !== String(textVal)) DOM[3].textContent = textVal;
                        } else {
                            DOM[3].textContent = textVal;
                        }
                        CACHE[3] = textVal; 
                    }
                 } 
if (mask & 1) { 
                    const textVal = String(F64[17]);
                    if (CACHE[4] !== textVal) { 
                        if (CACHE[4] === null) {
                            if (DOM[4].textContent !== String(textVal)) DOM[4].textContent = textVal;
                        } else {
                            DOM[4].textContent = textVal;
                        }
                        CACHE[4] = textVal; 
                    }
                 } 
 };
const r_exec_1 = (mem, mask) => { 
 const { F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, DOM, CACHE, GRAPH } = mem;
let v=0, _res=0;
 
 if (mask & 1073741824) { 
                    const textVal = String(F64[18]);
                    if (CACHE[5] !== textVal) { 
                        if (CACHE[5] === null) {
                            if (DOM[5].textContent !== String(textVal)) DOM[5].textContent = textVal;
                        } else {
                            DOM[5].textContent = textVal;
                        }
                        CACHE[5] = textVal; 
                    }
                 } 
if (mask & 536870912) { const val = I32[1];
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
  "PORT_CART_QTY": { 
    id: 1, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_R[0] |= 268435456; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; FLAGS_R[1] |= 536870912; L2_R[0] |= 1073741824; L1_R[0] |= -2147483648;  } 
  },
  "PORT_CART_SUBTOTAL": { 
    id: 0, 
    type: "F64", 
    semantic: "F64", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; markBatch(FLAGS_C, L2_C, L1_C, GRAPH, 0, 4); FLAGS_R[0] |= 67108864; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648;  } 
  },
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "Cart_" + instanceId : "Cart";
        
        const mem = allocMemory(COUNTS, "Cart");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([0,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.08,0,0]); 
        I32.set([0,0,1,0,30000,2,0,0,1,0]); 
        U8.set([1]);
        GRAPH.set([7,19,21,28]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: (newVal) => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
const _newVal_newVal = setDynamicString(newVal);
if (I32[9] !== _newVal_newVal) {
  if (I32[9] < 0) releaseDynamicString(I32[9]);
  I32[9] = _newVal_newVal;
} else {
  if (_newVal_newVal < 0) releaseDynamicString(_newVal_newVal);
}
const _tempVal_2 = I32[9];
if (_tempVal_2 < 0) retainDynamicString(_tempVal_2);
if (I32[0] < 0) releaseDynamicString(I32[0]);
I32[0] = _tempVal_2;
FLAGS_C[0] |= 4194304; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_C[0] |= 65536; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648; Motherboard.wakeUp(); }
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

        const STR_INDICES = [0,2,5,9];

        

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
