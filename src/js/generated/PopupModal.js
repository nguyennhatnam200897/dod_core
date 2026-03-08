import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, unplug, plug, Motherboard, getDynamicString } from '../runtime_v44.js';

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
                    const textVal = (LUT[1] || LUT[0]) + (I32[1] >= 0 ? (LUT[I32[1]] || LUT[0]) : getDynamicString(I32[1])) + (LUT[2] || LUT[0]);
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
export default createPopupModal;
