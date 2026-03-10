import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, unplug, plug, Motherboard, getDynamicString } from '../runtime_v44.js';

// --- COMPONENT: ProductItem ---
const createProductItem = (() => {
    const COUNTS = {"f64":1,"i32":12,"u8":1,"sinks":7,"totalNodes":20,"graphSize":0};
    const FINGERPRINT = [{"idx":0,"type":"TRANSFORM_Y","selector":".virtual-wrapper"},{"idx":1,"type":"TEXT","selector":".tex-id"},{"idx":2,"type":"TEXT","selector":".product-price"},{"idx":3,"type":"TEXT","selector":".product-stock"},{"idx":4,"type":"SHOW","selector":".badge-out","displayStyle":"block"},{"idx":5,"type":"ATTR","selector":".btn-buy"},{"idx":6,"type":"CLASS","selector":".btn-buy","className":"btn-disabled"}];
    const LUT = ["","Sản phẩm này"];
    const EVENTS = [{"selector":".btn-buy","eventName":"click","actionName":"act_0","inputs":[]}];
    const SINKS = [1,3,5,9,12,13,14];

    // Các hàm tính toán c_exec_x được giữ lại dưới dạng "dự phòng", 
    // trong thực tế khi chạy WASM, mảng này không còn được đụng tới nữa.
    const c_exec_0 = null;
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
if (mask & 4194304) { 
                    const textVal = String(I32[4]);
                    if (CACHE[3] !== textVal) { 
                        if (CACHE[3] === null) {
                            if (DOM[3].textContent !== String(textVal)) DOM[3].textContent = textVal;
                        } else {
                            DOM[3].textContent = textVal;
                        }
                        CACHE[3] = textVal; 
                    }
                 } 
if (mask & 524288) { const val = I32[6];
if (CACHE[4] !== val) { 
  const targetStyle = val ? "block" : "none";
  if (CACHE[4] === null) {
    if (DOM[4].style.display !== targetStyle) DOM[4].style.display = targetStyle;
  } else {
    DOM[4].style.display = targetStyle;
  }
  CACHE[4] = val; 
} } 
if (mask & 262144) { const val = I32[6];
if (CACHE[5] !== val) { 
  if (CACHE[5] === null) {
    const hasAttr = DOM[5].hasAttribute('disabled');
    if (val && !hasAttr) DOM[5].setAttribute('disabled', '');
    else if (!val && hasAttr) DOM[5].removeAttribute('disabled');
  } else {
    if (val) DOM[5].setAttribute('disabled', '');
    else DOM[5].removeAttribute('disabled');
  }
  CACHE[5] = val; 
} } 
if (mask & 131072) { const val = I32[6];
if (CACHE[6] !== val) { 
  if (CACHE[6] === null) {
    const hasClass = DOM[6].classList.contains("btn-disabled");
    if (val && !hasClass) DOM[6].classList.add("btn-disabled");
    else if (!val && hasClass) DOM[6].classList.remove("btn-disabled");
  } else {
    if (val) DOM[6].classList.add("btn-disabled");
    else DOM[6].classList.remove("btn-disabled");
  }
  CACHE[6] = val; 
} } 
 };

    const BATCHES_C = [
c_exec_0
];
    const BATCHES_R = [
r_exec_0
];

    const EXPORTED_PORTS = {
  "V_INDEX": { 
    id: 8, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem;  } 
  },
  "TRANSFORM_Y": { 
    id: 0, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_R[0] |= 1073741824; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648;  } 
  },
  "PORT_REAL_INDEX": { 
    id: 9, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem;  } 
  },
  "PORT_ID": { 
    id: 1, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_R[0] |= 268435456; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648;  } 
  },
  "PORT_PRICE": { 
    id: 0, 
    type: "F64", 
    semantic: "F64", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_R[0] |= 67108864; L2_R[0] |= -2147483648; L1_R[0] |= -2147483648;  } 
  },
  "PORT_STOCK": { 
    id: 2, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_C[0] |= 8388608; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648;  } 
  },
  "PORT_CART_QTY": { 
    id: 3, 
    type: "I32", 
    semantic: "I32", 
    propagate: (mem) => { const { FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH } = mem; FLAGS_C[0] |= 8388608; L2_C[0] |= -2147483648; L1_C[0] |= -2147483648;  } 
  },
};

    return function(root, actions = {}, instanceId = "") {
        const finalName = instanceId !== "" ? "ProductItem_" + instanceId : "ProductItem";
        
        const mem = allocMemory(COUNTS, "ProductItem");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([0]); 
        I32.set([0,0,0,0,0,0,0,1,0,0,0,0]); 
        U8.set([1]);
        GRAPH.set([]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
const _disp_0_arg_0 = ((((I32[2] - I32[3])) <= I32[5] ? 1 : 0));
const _disp_0_arg_1 = I32[7];
const _disp_1_arg_0 = I32[9];
const _disp_1_arg_1 = ((((I32[2] - I32[3])) > I32[10] ? 1 : 0));
Motherboard.callAction("PopupModal", "TRIGGER_ACTION", _disp_0_arg_0, _disp_0_arg_1 >= 0 ? (LUT[_disp_0_arg_1] || LUT[0]) : getDynamicString(_disp_0_arg_1));
if (typeof window["syncCartData"] === 'function') window["syncCartData"](_disp_1_arg_0, _disp_1_arg_1);
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

        const STR_INDICES = [7];

        

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
export default createProductItem;
