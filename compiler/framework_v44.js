import fs from 'fs';
import { execSync } from 'child_process'; 
import { compiler } from './compiler_v44.js';

// --- TYPE DEFINITIONS ---
const TYPE = { I32: 'I32', F64: 'F64', STR: 'STR', U8: 'U8' };

// --- NODE HANDLE ---
// Đại diện cho một biến trong graph
// --- NODE HANDLE ---
// --- CONDITION BUILDER (Fluent if/return/elseif/else) ---
class ConditionChain {
    constructor(initialCond) {
        this.branches = []; // Lưu danh sách các nhánh { cond, val }
        this.currentCond = resolve(initialCond);
    }

    return(valInput) {
        if (!this.currentCond) {
            // Sửa thông báo lỗi: then -> return
            throw new Error("[DSL] Missing condition before calling .return()");
        }
        this.branches.push({ 
            cond: this.currentCond, 
            val: resolve(valInput) 
        });
        this.currentCond = null; // Reset để chờ elseif hoặc else
        return this;
    }

    elseif(condInput) {
        if (this.currentCond) {
            // Sửa thông báo lỗi: then -> return
            throw new Error("[DSL] You must call .return() before .elseif()");
        }
        this.currentCond = resolve(condInput);
        return this;
    }

    else(fallbackInput) {
        if (this.currentCond) {
            throw new Error("[DSL] You must call .return() before .else()");
        }
        
        let result = resolve(fallbackInput);
        
        // Trình biên dịch mảng nhánh từ phải qua trái (dưới lên trên)
        for (let i = this.branches.length - 1; i >= 0; i--) {
            const branch = this.branches[i];
            
            // Kiểm tra kiểu dữ liệu đồng nhất
            if (branch.val.type !== result.type) {
                throw new Error(`[DSL] Type mismatch in if/else branches: ${branch.val.type} vs ${result.type}. Please explicit cast().`);
            }
            
            // Tái sử dụng hàm compiler.ifElse
            const newId = compiler.ifElse(branch.cond, branch.val, result)._id;
            result = new NodeHandle(newId, branch.val.type);
        }
        
        // Trả về một NodeHandle duy nhất đại diện cho toàn bộ khối logic này
        return result;
    }
}

class NodeHandle {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }

    // --- 1. Nhóm toán tử 1 tham số (Unary) ---
    _unary(methodName, retType = null) {
        const resultType = retType || this.type;
        const newId = compiler[methodName](this)._id;
        return new NodeHandle(newId, resultType);
    }
    
    abs() { return this._unary('abs'); }
    sin() { return this._unary('sin', TYPE.F64); }
    cos() { return this._unary('cos', TYPE.F64); }
    not() { return this._unary('not', TYPE.I32); } // Logic NOT trả về I32 (0 hoặc 1)

    // --- 2. Nhóm toán tử 2 tham số (Binary) ---
    _op(methodName, rhsInput, retType = null, strictType = true) {
        const rhs = resolve(rhsInput);
        
        // Cảnh báo Strict Type cho các phép toán yêu cầu cùng kiểu (Tránh logic so sánh bị check strict quá ngặt nghèo)
        if (strictType && this.type !== rhs.type) {
            throw new Error(`Type Mismatch: ${this.type} ${methodName} ${rhs.type}. Explicit cast required.`);
        }

        const resultType = retType || this.type;
        const newId = compiler[methodName](this, rhs)._id;
        return new NodeHandle(newId, resultType);
    }

    // Basic Math
    add(rhs) { return this._op('add', rhs); }
    sub(rhs) { return this._op('sub', rhs); }
    mul(rhs) { return this._op('mul', rhs); }
    div(rhs) { return this._op('div', rhs, TYPE.F64); } // Phép chia thường ép kết quả ra Float
    mod(rhs) { return this._op('mod', rhs); }

    // Bitwise (Sử dụng Strict Type và ép kết quả ra I32)
    bitAnd(rhs) { return this._op('bitAnd', rhs, TYPE.I32, true); }
    bitOr(rhs)  { return this._op('bitOr', rhs, TYPE.I32, true); }
    bitXor(rhs) { return this._op('bitXor', rhs, TYPE.I32, true); }
    lshift(rhs) { return this._op('lshift', rhs, TYPE.I32, true); }
    rshift(rhs) { return this._op('rshift', rhs, TYPE.I32, true); }

    // Relational (Bỏ check Strict Type để linh hoạt, trả về I32: 0 hoặc 1)
    eq(rhs)  { return this._op('eq', rhs, TYPE.I32, false); }
    neq(rhs) { return this._op('neq', rhs, TYPE.I32, false); }
    gt(rhs)  { return this._op('gt', rhs, TYPE.I32, false); }
    lt(rhs)  { return this._op('lt', rhs, TYPE.I32, false); }
    gte(rhs) { return this._op('gte', rhs, TYPE.I32, false); }
    lte(rhs) { return this._op('lte', rhs, TYPE.I32, false); }

    // Logical
    and(rhs) { return this._op('and', rhs, TYPE.I32, false); }
    or(rhs)  { return this._op('or', rhs, TYPE.I32, false); }

    // --- 3. Nhóm nhiều tham số (Variadic) ---
    _variadic(methodName, others, retType = null) {
        const resolved = others.map(resolve);
        const args = [this, ...resolved];
        const newId = compiler[methodName](...args)._id;
        return new NodeHandle(newId, retType || this.type);
    }

    sum(...others)     { return this._variadic('sum', others); }
    product(...others) { return this._variadic('product', others); }
    max(...others)     { return this._variadic('max', others); }
    min(...others)     { return this._variadic('min', others); }

    // --- 4. Tiện ích ---
    cast(targetType) { 
        const newId = compiler.cast(this, targetType)._id;
        return new NodeHandle(newId, targetType); 
    }

    // Thêm vào cuối class NodeHandle (trước hàm cast)
    ifElse(trueVal, falseVal) {
        const t = resolve(trueVal);
        const f = resolve(falseVal);
        
        // Strict Type: Nhánh True và False phải trả về cùng một kiểu dữ liệu
        if (t.type !== f.type) {
            throw new Error(`ifElse Error: True branch (${t.type}) and False branch (${f.type}) must have the same type. Explicit cast if needed.`);
        }
        
        const newId = compiler.ifElse(this, t, f)._id;
        return new NodeHandle(newId, t.type);
    }
}

// Helper: Xử lý số raw (5, 10.5) hoặc chuỗi thành NodeHandle
function resolve(val) {
    if (val instanceof NodeHandle) return val;
    
    if (typeof val === 'number') {
        const isInt = Number.isInteger(val);
        // Gọi compiler.signal chung, trả về object node có ._id
        const id = compiler.signal(val)._id;
        return new NodeHandle(id, isInt ? TYPE.I32 : TYPE.F64);
    }
    if (typeof val === 'string') {
        const id = compiler.signal(val)._id;
        return new NodeHandle(id, TYPE.STR);
    }
    
    throw new Error(`Unknown value type: ${val}`);
}

// --- MAIN BUILDER ---
export const blueprint = (componentName, setupFn) => {
    compiler.reset();

    const g = {
        i32: TYPE.I32,
        f64: TYPE.F64,
        str: TYPE.STR,
        u8:  TYPE.U8,

        // 1. SIGNAL & STATE
        state: (type, val) => {
            // Truyền type xuống compiler để ép lưu vào đúng mảng (Vd: U8)
            const node = compiler.signal(val, type); 
            return new NodeHandle(node._id, type);
        },

        // 2. UI Binding
        bindText: (sel, ...args) => compiler.bindText(sel, ...args),
        bindClass: (sel, className, node) => compiler.bindClass(resolve(node), sel, className),
        bindShow: (sel, node, displayStyle = 'block') => compiler.bindShow(resolve(node), sel, displayStyle),
        bindValue: (sel, node) => compiler.bindValue(resolve(node), sel),
        bindAttr: (sel, attrName, node) => compiler.bindAttr(resolve(node), sel, attrName),
        bindStyle: (sel, prop, node, unit = '') => compiler.bindStyle(resolve(node), sel, prop, unit),
        // 🌟 THÊM DÒNG NÀY VÀO ĐÂY:
        bindTransformY: (sel, node) => compiler.bindTransformY(resolve(node), sel),
        // THÊM MỚI: RÀNG BUỘC HAI CHIỀU (TWO-WAY BINDING)
        bindInput: (sel, stateNode) => {
            const handle = resolve(stateNode);
            
            // 1. Chiều Xuất (Output): State thay đổi -> Cập nhật Input value
            compiler.bindValue(handle, sel);

            // 2. Chiều Nhập (Input): Tạo Action ẩn để ghi đè State
            const actionDef = g.action(
                { newVal: handle.type }, // Khai báo tham số nhận vào cùng kiểu với state
                (tx, { newVal }) => {
                    tx.access(handle).set(newVal); // Gán giá trị mới vào state
                }
            );

            // 3. Đăng ký sự kiện: Người dùng gõ -> Kích hoạt Action -> Lan truyền Graph
            g.on(sel, 'input', actionDef, { newVal: "value" });
        },

        // 3. ACTION DEFINITION (Schema + Destructuring Support)
        action: (inputSchema, builderFn) => {
            // Tự động sinh tên action để compiler_v39 quản lý
            const actionName = `act_${compiler.actions.length}`;
            const argSignals = {};
            const argHandles = {};
            
            // Khởi tạo các Signal ẩn nhận giá trị từ giao diện
            Object.keys(inputSchema).forEach((key) => {
                const type = inputSchema[key];
                
                // --- SỬA Ở ĐÂY: Xóa dòng sig.mem thủ công đi ---
                const sig = compiler.signal(type === TYPE.STR ? "" : 0, type); 
                // XÓA DÒNG NÀY: sig.mem = (type === TYPE.STR) ? TYPE.I32 : type;
                
                argSignals[key] = sig._id;
                argHandles[key] = new NodeHandle(sig._id, type);
            });

            // Danh sách các thao tác ghi đè State
            const assignments = [];
            const dispatches = [];

            // Transaction Context 
            const tx = {
                access: (stateNode) => ({
                    get val() { return stateNode; }, 
                    
                    set: (valInput) => { 
                        const val = resolve(valInput);
                        if (stateNode.type !== val.type) throw new Error(`Write Error`);
                        // Thu thập phép gán vào mảng
                        assignments.push({ targetId: stateNode.id, sourceId: val.id });
                    },
                    
                    update: (fn) => { 
                        const newVal = fn(stateNode);
                        const val = resolve(newVal);
                        assignments.push({ targetId: stateNode.id, sourceId: val.id });
                    }
                }),
                // THÊM MỚI: API Gọi hàm RPC mượt mà
                call: (targetComponent, portName, ...argsInputs) => {
                    const argIds = argsInputs.map(a => {
                        const resolved = resolve(a);
                        // 🌟 BẢN VÁ: BẢO VỆ BIẾN KHỎI DEAD CODE ELIMINATION
                        // Khai báo với Compiler rằng Node này là một "Effect" ẩn để nó không bị xóa
                        if (resolved.id !== undefined) {
                            compiler.sinks.push(resolved.id); 
                        }
                        return resolved.id;
                    });
                    dispatches.push({ type: 'CALL', targetComponent, portName, argIds });
                },
                
                // THÊM MỚI: API gửi tín hiệu IPC mượt mà cho Dev
                send: (targetComponent, portName, valInput) => {
                    const val = resolve(valInput); 
                    // 🌟 BẢN VÁ BẢO VỆ BIẾN
                    if (val.id !== undefined) compiler.sinks.push(val.id);
                    
                    dispatches.push({
                        targetComponent,
                        portName,
                        sourceId: val.id
                    });
                },
                // 🌟 THÊM MỚI: Xả mảng dữ liệu vào List với Auto-Mapping
                renderList: (poolName, dataSourceStr, mapping) => {
                    dispatches.push({ type: 'RENDER_LIST', poolName, dataSource: dataSourceStr, mapping });
                },
                // 🌟 QUÀ TẶNG KÈM: Fetch từ URL và Xả vào List
                fetchAndRenderList: (url, poolName, mapping) => {
                    dispatches.push({ type: 'FETCH_RENDER_LIST', url, poolName, mapping });
                },
                // 🌟 DÁN HÀM renderVirtualList VÀO ĐÚNG CHỖ NÀY:
                renderVirtualList: (poolName, dataSourceStr, containerSelector, itemHeight, mapping) => {
                    dispatches.push({ type: 'VIRTUAL_LIST', poolName, dataSource: dataSourceStr, containerSelector, itemHeight, mapping });
                },
                // 🌟 THÊM MỚI: Cho phép Engine giao tiếp với Javascript Global
                callJS: (fnName, ...argsInputs) => {
                    const argIds = argsInputs.map(a => resolve(a).id);
                    dispatches.push({ type: 'CALL_JS', fnName, argIds });
                }
            };

            // Chạy logic của user để xây đồ thị và thu thập assignments
            builderFn(tx, argHandles);

            // THAY ĐỔI: Gửi thêm mảng dispatches cho Compiler xử lý
            compiler.mutationAction(actionName, argSignals, assignments, dispatches);
            
            return { actionId: actionName, schema: inputSchema };
        },
        
        // Mở cổng RPC cho Component khác gọi vào
        exportAction: (portName, actionDef) => compiler.registerExportAction(portName, actionDef.actionId),

        // 4. EVENT BINDING
        on: (selector, eventName, actionDef, extractMap) => {
            // CẬP NHẬT: Truyền thêm actionDef.schema xuống cho compiler
            compiler.bindEvent(selector, eventName, actionDef.actionId, extractMap, actionDef.schema);
        },

        // 🌟 THÊM MỚI: Chạy 1 lần duy nhất ngay khi Component boot xong
        onInit: (actionDef) => compiler.onInit(actionDef.actionId),
        
        // 🌟 THÊM MỚI (DX): Bí danh sự kiện (Shorthands)
        onClick:  (selector, actionDef, extractMap = {}) => g.on(selector, 'click', actionDef, extractMap),
        onInput:  (selector, actionDef, extractMap = { newVal: 'value' }) => g.on(selector, 'input', actionDef, extractMap),
        onChange: (selector, actionDef, extractMap = { newVal: 'value' }) => g.on(selector, 'change', actionDef, extractMap),
        onSubmit: (selector, actionDef, extractMap = {}) => g.on(selector, 'submit', actionDef, extractMap),

        // 5. THÊM MỚI: Cổng nhận dữ liệu từ Component khác
        publicInput: (portName, type, initialVal) => {
            // 1. Khởi tạo giá trị mặc định chuẩn Rust-style nếu user không truyền
            let val = initialVal;
            if (val === undefined) {
                val = (type === TYPE.STR) ? "" : 0;
            }

            // 2. Tạo một Signal ẩn dưới hệ thống (giống hệt g.state)
            const node = compiler.signal(val, type); 
            
            // 3. Đăng ký Cổng này với Compiler kèm theo ID gốc (pre-compile ID)
            compiler.registerExport(portName, node._id, type);

            // 4. Trả về NodeHandle để user có thể dùng biến này tính toán bên trong Component
            return new NodeHandle(node._id, type);
        },

        // 🌟 THÊM MỚI (DX): Gom cụm Props giống Vue
        defineProps: (schema) => {
            const props = {};
            for (const key in schema) {
                const def = schema[key];
                // Tự động gọi publicInput cho từng prop
                props[key] = g.publicInput(def.port, def.type, def.default);
            }
            return props;
        },

        // --- 6. TOÁN HẠNG 1 THAM SỐ (UNARY) ---
        abs: (a) => resolve(a).abs(),
        sin: (a) => resolve(a).sin(),
        cos: (a) => resolve(a).cos(),
        not: (a) => resolve(a).not(),

        // --- 7. TOÁN HẠNG 2 THAM SỐ (BINARY) ---
        add: (a, b) => resolve(a).add(b),
        sub: (a, b) => resolve(a).sub(b),
        mul: (a, b) => resolve(a).mul(b),
        div: (a, b) => resolve(a).div(b),
        mod: (a, b) => resolve(a).mod(b),

        bitAnd: (a, b) => resolve(a).bitAnd(b),
        bitOr:  (a, b) => resolve(a).bitOr(b),
        bitXor: (a, b) => resolve(a).bitXor(b),
        lshift: (a, b) => resolve(a).lshift(b),
        rshift: (a, b) => resolve(a).rshift(b),

        eq:  (a, b) => resolve(a).eq(b),
        neq: (a, b) => resolve(a).neq(b),
        gt:  (a, b) => resolve(a).gt(b),
        lt:  (a, b) => resolve(a).lt(b),
        gte: (a, b) => resolve(a).gte(b),
        lte: (a, b) => resolve(a).lte(b),

        and: (a, b) => resolve(a).and(b),
        or:  (a, b) => resolve(a).or(b),

        // --- 8. NHIỀU THAM SỐ (VARIADIC) ---
        // Lấy tham số đầu tiên làm gốc, truyền phần còn lại vào hàm
        sum:     (...args) => resolve(args[0]).sum(...args.slice(1)),
        product: (...args) => resolve(args[0]).product(...args.slice(1)),
        max:     (...args) => resolve(args[0]).max(...args.slice(1)),
        min:     (...args) => resolve(args[0]).min(...args.slice(1)),

        // --- 9. TIỆN ÍCH ---
        cast: (a, type) => resolve(a).cast(type),

        // Cập nhật dòng globalRead bên dưới các hàm state:
        globalRead: (globalArrStr, indexNode, type, unpackConfig = null) => {
            const node = compiler.globalRead(globalArrStr, indexNode, type, unpackConfig);
            return new NodeHandle(node._id, type);
        },

        // 🌟 THÊM MỚI CHỖ NÀY: API đọc chuỗi nhị phân
        dbReadString: (offsetNode, lengthNode) => {
            const off = resolve(offsetNode);
            const len = resolve(lengthNode);
            const node = compiler._add({
                type: 'COMPUTE', mem: 'I32', semantic: 'STR', pipeline: 'COMPUTE', inputs: [off.id, len.id],
                skipRust: true, // Chỉ JS giải mã chuỗi
                gen: (acc, target) => {
                    if (target === 'RUST') return `0`;
                    // Đọc từ DB và tự động nén vào String Arena
                    return `setDynamicString(getDbString(${acc[0]}, ${acc[1]}))`; 
                }
            });
            return new NodeHandle(node._id, TYPE.STR);
        },

        // --- 10. CONDITIONAL BRANCHING ---
        ifElse: (cond, trueVal, falseVal) => resolve(cond).ifElse(trueVal, falseVal),

        // Cú pháp Fluent Builder mới!
        if: (cond) => new ConditionChain(cond),

        // --- 11. REUSABLE LOGIC (COMPONENT / MACRO) ---
        component: (inputSchema, builderFn) => {
            // Trả về một hàm để user gọi lại sau này
            return (props) => {
                const resolvedProps = {};
                
                // 1. Kiểm tra Strict Type cho các tham số đầu vào (Props)
                for (const key in inputSchema) {
                    if (props[key] === undefined) {
                        throw new Error(`[DSL Component] Missing required prop: '${key}'`);
                    }
                    
                    const expectedType = inputSchema[key];
                    const val = resolve(props[key]);
                    
                    if (val.type !== expectedType) {
                        throw new Error(`[DSL Component] Type mismatch for prop '${key}'. Expected ${expectedType}, got ${val.type}.`);
                    }
                    
                    // Lưu lại node đã được resolve để truyền vào builder
                    resolvedProps[key] = val;
                }

                // 2. Chạy hàm Builder để nối dây đồ thị và trả về kết quả
                // Kết quả có thể là 1 NodeHandle, hoặc 1 Object chứa nhiều NodeHandles
                return builderFn(resolvedProps);
            };
        },
    };

    // Chạy file logic của user (code.js)
    setupFn(g);
    
    // Yêu cầu compiler sinh mã JS, trả về Object thay vì chuỗi trơn
    return {
        name: componentName,
        code: compiler.compile(componentName)
    };
};

// THÊM MỚI: Định nghĩa kiểu dữ liệu Hồ chứa (Pool)
export const pool = (blueprint, size) => ({ isPool: true, blueprint, size });

// 🌟 THÊM MỚI: Định nghĩa kiểu dữ liệu Lười biếng (Lazy/Template)
export const lazy = (blueprint, templateSelector) => ({ isLazy: true, blueprint, templateSelector });

// --- TRÌNH LẮP RÁP ỨNG DỤNG (APP BUNDLER TỰ ĐỘNG) ---
export const buildApp = (mountTargets, outputPath = './app_compiled.js') => {
    // 🌟 1. Nhập thêm bootEngineWasm
    let finalJSCode = `import { allocMemory, hydrate, runDispatch, markBatch, bindEvents, setDynamicString, retainDynamicString, releaseDynamicString, unplug, plug, Motherboard, initObjectPool, bootEngineWasm, Router, getDynamicString, STRING_ARENA, setDbStringMem, getDbString } from './runtime_v44.js';\n\n`;
    
    // 🌟 BẢN VÁ: Gói TẤT CẢ Component vào ĐÚNG 1 HÀM execute_batch duy nhất
    let combinedRustCode = `// 🚀 FILE TỰ ĐỘNG SINH BỞI ENGINE DOD\nuse super::MotherboardCore;\n\nimpl MotherboardCore {\n    pub fn execute_batch(&mut self, chunk_id: usize, mut mask: u32) {\n        match self.comp_name.as_str() {\n`;
    const uniqueComps = new Set();
    Object.values(mountTargets).forEach(target => {
        if (target.isPool || target.isLazy) uniqueComps.add(target.blueprint);
        else uniqueComps.add(target);
    });

    uniqueComps.forEach(comp => { 
        finalJSCode += comp.code.js + '\n\n'; 
        combinedRustCode += comp.code.rust + '\n'; // Các nhánh rẽ được nhét vào đây
    });

    // 🌟 BẢN VÁ: Đóng ngoặc khối lệnh
    combinedRustCode += `            _ => {}\n        }\n    }\n}\n`;

    // 🌟 MỚI: Export một hàm thay vì tự động chạy
    finalJSCode += `// --- API KHỞI CHẠY ENGINE ---\n`;
    finalJSCode += `export async function bootApp() {\n`;
    finalJSCode += `    await bootEngineWasm();\n\n`; 

    finalJSCode += `    window.mountComponents = () => {\n`;
    for (const [selector, target] of Object.entries(mountTargets)) {
        if (target.isPool) {
            finalJSCode += `        if (document.querySelector('${selector}')) initObjectPool('${target.blueprint.name}', create${target.blueprint.name}, '${selector}', ${target.size});\n`;
        } else if (target.isLazy) {
            finalJSCode += `        Motherboard.registerLazy('${target.blueprint.name}', create${target.blueprint.name}, '${target.templateSelector}', '${selector}');\n`;
        } else {
            finalJSCode += `        if (document.querySelector('${selector}')) create${target.name}(document.querySelector('${selector}'));\n`;
        }
    }
    finalJSCode += `    };\n\n`;

    finalJSCode += `    window.MB = Motherboard;\n`;
    finalJSCode += `    window.STRING_ARENA = STRING_ARENA;\n`;
    finalJSCode += `    window.getDynamicString = getDynamicString;\n`;
    finalJSCode += `    window.getDbString = getDbString;\n`;
    finalJSCode += `    console.log("✅ Bo mạch chủ đã khởi động! Mọi Component đã sẵn sàng.");\n`;

    // 🌟 ĐÃ XÓA BOOTSCRIPT BẰNG STRING Ở ĐÂY
    
    finalJSCode += `    window.mountComponents();\n`;
    finalJSCode += `    Router.init('#app-root', window.mountComponents);\n`;
    
    // 🌟 ĐÃ XÓA LỆNH TỰ GỌI startApp()
    finalJSCode += `}\n`;

    // 🌟 4. Ghi file JS
    fs.writeFileSync(outputPath, finalJSCode);
    console.log(`📝 Đã sinh mã Giao diện (JS): ${outputPath}`);

    // 🌟 5. Ghi file Rust và tự động gọi wasm-pack
    const rustFilePath = './rust_core/src/generated_compute.rs'; 
    fs.writeFileSync(rustFilePath, combinedRustCode);
    console.log(`🦀 Đã sinh mã Lõi Tính toán (Rust): ${rustFilePath}`);

    console.log("⚙️ Đang mài dũa C++/Rust thành WebAssembly...");
    try {
        // Build WASM siêu tốc
        execSync('wasm-pack build --target web --out-dir ../src/js/pkg', { 
            cwd: './rust_core', 
            stdio: 'inherit',
            shell: true // 🌟 THÊM DÒNG NÀY ĐỂ WINDOWS KHÔNG BỊ LỖI ENOENT
        });
        console.log(`🎉 HOÀN TẤT! Toàn bộ Engine đã sẵn sàng chiến đấu ở tốc độ Native!`);
    } catch (e) {
        console.error("❌ Lỗi khi biên dịch WASM!", e.message);
    }
};