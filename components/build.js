import { blueprint, buildApp, pool, lazy } from '../compiler/framework_v44.js';

// ==========================================
// COMPONENT 1: THẺ SẢN PHẨM (100% RUST CORE)
// ==========================================
const ProductItem = blueprint('ProductItem', (g) => {
    const props = g.defineProps({
        vIndex: { port: 'V_INDEX', type: g.i32, default: 0 },
        offsetY:  { port: 'TRANSFORM_Y', type: g.i32, default: 0 }
    });

    // 🌟 KHÔNG DÙNG globalRead. Khai báo Cổng để JS tự bơm Data vào Lõi Rust
    const realRowIndex = g.publicInput('PORT_REAL_INDEX', g.i32, 0);
    const id = g.publicInput('PORT_ID', g.i32, 0);
    const price = g.publicInput('PORT_PRICE', g.f64, 0);
    const stock = g.publicInput('PORT_STOCK', g.i32, 0);
    const cartQty = g.publicInput('PORT_CART_QTY', g.i32, 0);
    
    // Phép tính này giờ đây được chạy bằng WASM ở tốc độ cao nhất
    const remainStock = g.sub(stock, cartQty);
    const isOutOfStock = g.lte(remainStock, 0);

    g.bindTransformY('.virtual-wrapper', props.offsetY);
    g.bindText('.tex-id', id);
    g.bindText('.product-price', price); // Dùng CSS ::after { content: " đ" }
    g.bindText('.product-stock', remainStock);
    g.bindShow('.badge-out', isOutOfStock, 'block');
    g.bindAttr('.btn-buy', 'disabled', isOutOfStock);
    g.bindClass('.btn-buy', 'btn-disabled', isOutOfStock);

    const canAdd = g.gt(remainStock, 0); 
    const actualAdd = g.cast(canAdd, g.i32); 

    const buyAction = g.action({}, (tx) => {
        tx.call('PopupModal', 'TRIGGER_ACTION', isOutOfStock, g.state(g.str, "Sản phẩm này"));
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

    const closeAction = g.action({}, (tx) => { tx.access(isOpen).set(0); });
    g.onClick('.btn-close-modal', closeAction);
});

// ==========================================
// COMPONENT 2: GIỎ HÀNG THÔNG MINH (PURE PORTS INJECTION)
// ==========================================
const Cart = blueprint('Cart', (g) => {
    // 🌟 SỬA LỖI TUYỆT ĐỐI: Thay vì dùng g.state + g.action, ta mở Cổng Public!
    const totalQty = g.publicInput('PORT_CART_QTY', g.i32, 0);
    const subTotal = g.publicInput('PORT_CART_SUBTOTAL', g.f64, 0); 
    
    const promoCode = g.state(g.str, ""); 
    g.bindInput('#promo-input', promoCode);

    const isVipCode = g.eq(promoCode, "VIP2026");
    const isFreeShip = g.eq(promoCode, "FREESHIP");

    // Toán học Branchless (Không rẽ nhánh, dòng điện luôn thông)
    const vipF = g.cast(isVipCode, g.f64);
    const freeF = g.cast(isFreeShip, g.f64);

    const vipDiscount = g.mul( g.mul(subTotal, g.cast(0.2, g.f64)), vipF );
    const freeDiscount = g.mul( g.cast(30000, g.f64), freeF );
    const discountAmt = g.add(vipDiscount, freeDiscount);

    const isExceed = g.gt(discountAmt, subTotal);
    const exceedF = g.cast(isExceed, g.f64);
    const notExceedF = g.sub(g.cast(1, g.f64), exceedF); 

    const safeDiscount = g.add(
        g.mul(exceedF, subTotal),
        g.mul(notExceedF, discountAmt)
    );
    
    const priceAfterDiscount = g.sub(subTotal, safeDiscount);
    const vatAmt = g.mul(priceAfterDiscount, g.cast(0.08, g.f64));
    const finalTotal = g.add(priceAfterDiscount, vatAmt);

    g.bindText('#cart-qty', totalQty);
    g.bindText('#cart-subtotal', subTotal);
    g.bindText('#cart-discount', safeDiscount);
    g.bindText('#cart-vat', vatAmt);
    g.bindText('#cart-final', finalTotal);
    g.bindShow('#btn-checkout', totalQty, 'block');

    // ❌ KHÔNG CẦN BẤT KỲ g.exportAction NÀO NỮA!
});

// ==========================================
// COMPONENT 3: TRÌNH QUẢN LÝ (GOM THÀNH HOMEVIEW)
// ==========================================
const HomeView = blueprint('HomeView', (g) => {
    const initStore = g.action({}, (tx) => {
        tx.renderVirtualList('ProductItem', 'window.CURRENT_VIEW_INDICES', '#product-grid', 140, {
            $index: 'V_INDEX' 
        });
    });
    g.onInit(initStore);
});

// ==========================================
// COMPONENT 4: THANH ĐIỀU HƯỚNG APP SHELL
// ==========================================
const HeaderView = blueprint('HeaderView', (g) => {
    // 1. Khai báo state lưu số lượng tổng trong RAM Rust
    const globalQty = g.state(g.i32, 0);

    // 2. Ràng buộc với thẻ badge trên Header
    g.bindText('#global-cart-qty', globalQty);

    // 3. Mở cổng RPC để Main.js bắn tín hiệu vào
    const syncHeaderAction = g.action({ totalQ: g.i32 }, (tx, inputs) => {
        tx.access(globalQty).set(inputs.totalQ);
    });
    g.exportAction('SYNC_HEADER_CART', syncHeaderAction);
});

// 🌟 XUẤT CHUNK RỜI BẰNG BỘ BUNDLER MỚI
buildApp([HomeView, Cart, PopupModal, ProductItem, HeaderView], './src/js/generated');