import { blueprint, buildApp, pool, lazy } from '../compiler/framework_v44.js';

// ==========================================
// COMPONENT 1: THẺ SẢN PHẨM (INDIRECTION ARRAY)
// ==========================================
const ProductItem = blueprint('ProductItem', (g) => {
    // 1. Cổng nhận V_INDEX thay vì ROW_INDEX (Index Ảo trên màn hình)
    const props = g.defineProps({
        vIndex: { port: 'V_INDEX', type: g.i32, default: 0 },
        offsetY:  { port: 'TRANSFORM_Y', type: g.i32, default: 0 }
    });

    // 🌟 KỸ THUẬT MẢNG GIÁN TIẾP (INDIRECTION)
    // Lấy Index Ảo tra vào Mảng Chỉ mục để suy ra ID Thật trong Database
    const realRowIndex = g.globalRead('window.CURRENT_VIEW_INDICES', props.vIndex, g.i32);

    // 2. Chọc thẳng vào Cột RAM bằng realRowIndex (Thay vì props.vIndex)
    const id = g.globalRead('window.DB.ids', realRowIndex, g.i32);
    const price = g.globalRead('window.DB.prices', realRowIndex, g.f64);
    const stock = g.globalRead('window.DB.stocks', realRowIndex, g.i32);
    
    const nameOffset = g.globalRead('window.DB.nameOffsets', realRowIndex, g.i32);
    const nameLength = g.globalRead('window.DB.nameLengths', realRowIndex, g.i32);
    const name = g.dbReadString(nameOffset, nameLength);

    // Bóng trạng thái (Sử dụng realRowIndex để ánh xạ đúng sản phẩm)
    const cartQtyBase = g.globalRead('window.DB_CART_QTY', realRowIndex, g.i32);
    
    const lastInteractedRow = g.state(g.i32, -1);
    const localQty = g.state(g.i32, 0);

    const isInteracting = g.eq(lastInteractedRow, realRowIndex);
    const cartQty = g.if(isInteracting).return(localQty).else(cartQtyBase);

    // (Logic Tính tồn kho giữ nguyên)
    const remainStock = g.sub(stock, cartQty);
    const isOutOfStock = g.lte(remainStock, 0);
    const isLowStock = g.and( g.gt(remainStock, 0), g.lte(remainStock, 5) );

    // Giao diện (Giữ nguyên)
    g.bindTransformY('.virtual-wrapper', props.offsetY);
    g.bindText('.tex-id', id);
    g.bindText('.product-name', name);
    g.bindText('.product-price', price, " đ");
    g.bindText('.product-stock', remainStock);
    g.bindShow('.badge-out', isOutOfStock, 'block');
    g.bindShow('.badge-low', isLowStock, 'block');
    g.bindAttr('.btn-buy', 'disabled', isOutOfStock);
    g.bindClass('.btn-buy', 'btn-disabled', isOutOfStock);

    // Mua hàng (Gửi realRowIndex ra ngoài)
    const canAdd = g.lt(cartQty, stock); 
    const actualAdd = g.if(canAdd).return(1).else(0);
    const nextRemainStock = g.sub(remainStock, actualAdd);
    const isError = g.lte(nextRemainStock, 0);

    const buyAction = g.action({}, (tx) => {
        tx.access(lastInteractedRow).set(realRowIndex);
        tx.access(localQty).set( g.add(cartQty, actualAdd) );

        tx.call('Cart', 'ADD_ITEM_ACTION', actualAdd, price);
        tx.call('PopupModal', 'TRIGGER_ACTION', isError, name);
        // 🌟 Đồng bộ bằng ID Thật
        tx.callJS('syncCartData', realRowIndex, actualAdd);
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
    // 🌟 THÊM MỚI: Cổng đồng bộ Giỏ hàng khi vừa tải trang xong
    const syncAction = g.action({ totalQ: g.i32, totalS: g.i32 }, (tx, inputs) => {
        tx.access(totalQty).set(inputs.totalQ);
        tx.access(subTotal).set(inputs.totalS);
    });
    g.exportAction('SYNC_CART_ACTION', syncAction);
});

// ==========================================
// COMPONENT 3: TRÌNH QUẢN LÝ
// ==========================================
const ShopManager = blueprint('ShopManager', (g) => {
    const initStore = g.action({}, (tx) => {
        // Khởi động bằng Mảng Tham Chiếu
        tx.renderVirtualList('ProductItem', 'window.CURRENT_VIEW_INDICES', '#product-grid', 140, {
            $index: 'V_INDEX' 
        });
    });
    g.onInit(initStore);
});

// ==========================================
// ĐÓNG GÓI VÀ XUẤT XƯỞNG DỰ ÁN
// ==========================================
buildApp({
    'body': ShopManager,
    '#product-grid': pool(ProductItem, 20),
    '#cart-widget': Cart,
    '#modal-container': lazy(PopupModal, '#modal-tpl') 
}, './src/js/app_compiled.js');