import { blueprint, buildApp, pool, lazy } from './framework_v44.js';

// ==========================================
// COMPONENT 1: THẺ SẢN PHẨM (ZERO-COPY RAM)
// ==========================================
const ProductItem = blueprint('ProductItem', (g) => {
    // 1. Nhận Index dòng dữ liệu từ Virtual Scroll
    const props = g.defineProps({
        rowIndex: { port: 'ROW_INDEX', type: g.i32, default: 0 },
        offsetY:  { port: 'TRANSFORM_Y', type: g.i32, default: 0 }
    });

    const id = g.globalRead('DB.ids', props.rowIndex, g.i32);
    const price = g.globalRead('DB.prices', props.rowIndex, g.f64);
    const stock = g.globalRead('DB.stocks', props.rowIndex, g.i32);
    
    const nameOffset = g.globalRead('DB.nameOffsets', props.rowIndex, g.i32);
    const nameLength = g.globalRead('DB.nameLengths', props.rowIndex, g.i32);
    const name = g.dbReadString(nameOffset, nameLength);

    // 🌟 THUẬT TOÁN BÓNG TRẠNG THÁI (ĐÃ FIX LỖI DOUBLE COUNT)
    const cartQtyBase = g.globalRead('window.DB_CART_QTY', props.rowIndex, g.i32);
    
    // Lưu lại index của row cuối cùng mà User đã BẤM NÚT trên Thẻ này
    const lastInteractedRow = g.state(g.i32, -1);
    // Lưu lại số lượng tổng của row đó
    const localQty = g.state(g.i32, 0);

    // Kiểm tra xem thẻ này có đang thao tác đúng cái row mình vừa bấm không?
    const isInteracting = g.eq(lastInteractedRow, props.rowIndex);

    // BÍ QUYẾT: Nếu đang bấm liên tục -> Lấy localQty. Nếu vừa cuộn tới -> Lấy cartQtyBase từ RAM.
    const cartQty = g.if(isInteracting).return(localQty).else(cartQtyBase);

    // 2. Logic tính toán Tồn kho (Dựa trên cartQty chuẩn)
    const remainStock = g.sub(stock, cartQty);
    const isOutOfStock = g.lte(remainStock, 0);
    const isLowStock = g.and( g.gt(remainStock, 0), g.lte(remainStock, 5) );

    // 3. Ràng buộc giao diện
    g.bindTransformY('.virtual-wrapper', props.offsetY); 
    g.bindText('.product-name', name);
    g.bindText('.product-price', price, " đ");
    g.bindText('.product-stock', remainStock);
    g.bindShow('.badge-out', isOutOfStock, 'block');
    g.bindShow('.badge-low', isLowStock, 'block');
    g.bindAttr('.btn-buy', 'disabled', isOutOfStock);
    g.bindClass('.btn-buy', 'btn-disabled', isOutOfStock);

    // 4. Logic Mua hàng cực kỳ chính xác
    const canAdd = g.lt(cartQty, stock); 
    const actualAdd = g.if(canAdd).return(1).else(0);
    
    // 🌟 BẢN VÁ POPUP: Nhìn trước tương lai!
    // Trừ thử số lượng, nếu tương lai kho về <= 0 thì bật Popup cảnh báo ngay lập tức
    const nextRemainStock = g.sub(remainStock, actualAdd);
    const isError = g.lte(nextRemainStock, 0);

    const buyAction = g.action({}, (tx) => {
        // Cập nhật State: Nhớ lại dòng mình vừa bấm
        tx.access(lastInteractedRow).set(props.rowIndex);
        
        // 🌟 QUAN TRỌNG: Cập nhật localQty = cartQty (chính xác hiện tại) + actualAdd
        tx.access(localQty).set( g.add(cartQty, actualAdd) );

        // Phát lệnh ra ngoài hệ thống
        tx.call('Cart', 'ADD_ITEM_ACTION', actualAdd, price);
        tx.call('PopupModal', 'TRIGGER_ACTION', isError, name);
        tx.callJS('syncCartData', props.rowIndex, actualAdd);
    });
    g.onClick('.btn-buy', buyAction);
});

// ==========================================
// COMPONENT 1.5: MODAL CẢNH BÁO TỒN KHO
// ==========================================
const PopupModal = blueprint('PopupModal', (g) => {
    const isOpen = g.state(g.i32, 0);
    const msg = g.state(g.str, ""); 

    g.bindShow('.modal-overlay', isOpen, 'flex');
    g.bindText('#modal-msg', "Bạn không thể thêm ", msg, " nữa vì đã hết hàng trong kho.");

    const triggerAction = g.action({ shouldOpen: g.i32, productName: g.str }, (tx, inputs) => {
        const nextState = g.if(inputs.shouldOpen).return(1).else(isOpen);
        const nextMsg = g.if(inputs.shouldOpen).return(inputs.productName).else(msg);
        
        tx.access(isOpen).set(nextState);
        tx.access(msg).set(nextMsg);
    });
    g.exportAction('TRIGGER_ACTION', triggerAction);

    const closeAction = g.action({}, (tx) => {
        tx.access(isOpen).set(0);
    });
    g.onClick('.btn-close-modal', closeAction);
});

// ==========================================
// COMPONENT 2: GIỎ HÀNG THÔNG MINH
// ==========================================
const Cart = blueprint('Cart', (g) => {
    const totalQty = g.state(g.i32, 0);
    const subTotal = g.state(g.i32, 0);
    const promoCode = g.state(g.str, ""); 

    g.bindInput('#promo-input', promoCode);

    const isVipCode = g.eq(promoCode, "VIP2026");
    const isFreeShip = g.eq(promoCode, "FREESHIP");

    const discountAmt = g.if(isVipCode).return( g.cast(g.div(g.mul(subTotal, 20), 100), g.i32) )
                         .elseif(isFreeShip).return( 30000 )
                         .else( 0 );

    const safeDiscount = g.min(discountAmt, subTotal);
    const priceAfterDiscount = g.sub(subTotal, safeDiscount);
    const vatAmt = g.cast(g.div(g.mul(priceAfterDiscount, 8), 100), g.i32);

    const finalTotal = g.add(priceAfterDiscount, vatAmt);

    g.bindText('#cart-qty', totalQty);
    g.bindText('#cart-subtotal', subTotal, " đ");
    g.bindText('#cart-discount', safeDiscount, " đ");
    g.bindText('#cart-vat', vatAmt, " đ");
    g.bindText('#cart-final', finalTotal, " đ");
    g.bindShow('#btn-checkout', g.gt(totalQty, 0), 'block');

    const addItemAction = g.action({ qty: g.i32, price: g.f64 }, (tx, { qty, price }) => {
        tx.access(totalQty).update(val => g.add(val, qty));
        const amtToAdd = g.cast(g.mul( g.cast(qty, g.f64), price ), g.i32);
        tx.access(subTotal).update(val => g.add(val, amtToAdd));
    });
    g.exportAction('ADD_ITEM_ACTION', addItemAction);
});

// ==========================================
// COMPONENT 3: TRÌNH QUẢN LÝ
// ==========================================
const ShopManager = blueprint('ShopManager', (g) => {
    const initStore = g.action({}, (tx) => {
        tx.renderVirtualList('ProductItem', 'window.DB_DUMMY_ARRAY', '#product-grid', 140, {
            $index: 'ROW_INDEX' 
        });
    });
    g.onInit(initStore);
});

// ==========================================
// ĐÓNG GÓI VÀ XUẤT XƯỞNG DỰ ÁN
// ==========================================
const myProjectBootScript = `
    console.log("[Project] Đang tải products.bin...");
    const res = await fetch('./products.bin');
    const buffer = await res.arrayBuffer();
    const view = new DataView(buffer);
    const N = view.getInt32(0, true);
    const stringBytesLen = view.getInt32(4, true);
    
    let cursor = 8;
    window.DB.ids = new Int32Array(buffer, cursor, N); cursor += N * 4;
    window.DB.prices = new Float64Array(buffer, cursor, N); cursor += N * 8;
    window.DB.stocks = new Int32Array(buffer, cursor, N); cursor += N * 4;
    window.DB.nameOffsets = new Int32Array(buffer, cursor, N); cursor += N * 4;
    window.DB.nameLengths = new Int32Array(buffer, cursor, N); cursor += N * 4;
    
    const strMem = new Uint8Array(buffer, cursor, stringBytesLen);
    setDbStringMem(strMem);
    
    window.DB_CART_QTY = new Int32Array(N);
    window.DB_DUMMY_ARRAY = new Array(N).fill(0);
    
    console.log(\`[Project] Đã nạp thành công \${N} sản phẩm vào RAM tĩnh.\`);
`;

buildApp({
    'body': ShopManager,
    '#product-grid': pool(ProductItem, 20),
    '#cart-widget': Cart,
    '#modal-container': lazy(PopupModal, '#modal-tpl') 
}, './app_compiled.js', myProjectBootScript);