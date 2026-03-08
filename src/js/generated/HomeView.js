import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, unplug, plug, Motherboard, getDynamicString } from '../runtime_v44.js';

// --- COMPONENT: HomeView ---
const createHomeView = (() => {
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
        const finalName = instanceId !== "" ? "HomeView_" + instanceId : "HomeView";
        
        const mem = allocMemory(COUNTS, "HomeView");
        const { F64, I32, U8, DOM, CACHE, GRAPH, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R } = mem; 
        
        F64.set([]); 
        I32.set([]); 
        U8.set([1]);
        GRAPH.set([]);

        hydrate(root, FINGERPRINT, mem.DOM, mem.CACHE);

        Object.assign(actions, {
            act_0: () => { const {F64, I32, U8, FLAGS_C, L2_C, L1_C, FLAGS_R, L2_R, L1_R, GRAPH} = mem;
Motherboard.initVirtualScroll("ProductItem", "#product-grid", window.CURRENT_VIEW_INDICES, 140, (instanceMbId, rowData, rowIndex) => {
  Motherboard.sendSignal(instanceMbId, "V_INDEX", rowIndex);
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
export default createHomeView;
