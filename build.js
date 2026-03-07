import { blueprint, buildApp, pool, lazy } from './framework_v44.js';

// ==========================================
// COMPONENT 1: THẺ SẢN PHẨM (ZERO-COPY RAM)
// ==========================================
const ProductItem = blueprint('ProductItem', (g) => {
    const props = g.defineProps({
        rowIndex: { port: 'ROW_INDEX', type: g.i32, default: 0 },
        offsetY:  { port: 'TRANSFORM_Y', type: g.i32, default: 0 }
    });

    const id = g.globalRead('window.DB.ID', props.rowIndex, g.i32);
    const name = g.globalRead('window.DB.NAME', props.rowIndex, g.str);
    const cartQty = g.globalRead('window.DB.CART_QTY', props.rowIndex, g.i32);

    // 🌟 KỲ QUAN DATA-ORIENTED: GIẢI NÉN TỪ MẢNG GỘP
    // 1. Lấy Price: Đọc 24 bit cuối cùng (mask 0xFFFFFF)
    const price = g.globalRead('window.DB.PACKED_DATA', props.rowIndex, g.i32, { mask: 0xFFFFFF });
    
    // 2. Lấy Stock: Đọc 8 bit đầu tiên (Dịch phải 24 bit, rồi chặn bằng mask 0xFF)
    const stock = g.globalRead('window.DB.PACKED_DATA', props.rowIndex, g.i32, { shift: 24, mask: 0xFF });
    const remainStock = g.sub(stock, cartQty);

    // 3. Logic UI giữ nguyên, nhưng dùng các biến cục bộ vừa lấy được
    const isOutOfStock = g.lte(remainStock, 0);
    const isLowStock = g.and( g.gt(remainStock, 0), g.lte(remainStock, 5) );

    g.bindTransformY('.virtual-wrapper', props.offsetY); 
    g.bindText('.product-name', name);
    g.bindText('.product-price', price, " đ");
    g.bindText('.product-stock', remainStock);
    g.bindShow('.badge-out', isOutOfStock, 'block');
    g.bindShow('.badge-low', isLowStock, 'block');
    g.bindAttr('.btn-buy', 'disabled', isOutOfStock);
    g.bindClass('.btn-buy', 'btn-disabled', isOutOfStock);

    const canAdd = g.lt(cartQty, stock); 
    const actualAdd = g.if(canAdd).return(1).else(0);
    // 🌟 LOGIC MỚI: Kích hoạt Popup ngay khi vừa cạn kho
    // 1. Nhìn trước tương lai: Tồn kho sẽ còn lại bao nhiêu SAU cú click này?
    const nextRemainStock = g.sub(remainStock, actualAdd);
    
    // 2. Nếu tồn kho tương lai chạm mốc 0 (hoặc nhỏ hơn), lập tức xả điện gọi Popup!
    const isError = g.lte(nextRemainStock, 0);

    const buyAction = g.action({}, (tx) => {
        // Gửi sang Giỏ Hàng
        tx.call('Cart', 'ADD_ITEM_ACTION', actualAdd, price);
        // Gọi Popup
        tx.call('PopupModal', 'TRIGGER_ACTION', isError, name);
        // Đồng bộ ngược ra DB Toàn cục
        tx.callJS('syncCartData', id, actualAdd);
        
        // Cập nhật giao diện: Tăng biến cartQty hiện tại lên
        // (Lưu ý: Do chúng ta đọc từ mảng toàn cục, nên phải ép cập nhật biến cục bộ tạm thời)
        tx.access(cartQty).update(val => g.add(val, actualAdd));
    });
    g.onClick('.btn-buy', buyAction);
});

// ==========================================
// COMPONENT 1.5: MODAL CẢNH BÁO TỒN KHO
// ==========================================
const PopupModal = blueprint('PopupModal', (g) => {
    const isOpen = g.state(g.i32, 0);
    const msg = g.state(g.str, ""); // Tên sản phẩm bị lỗi

    // Hiện Modal bằng CSS display: flex nếu isOpen == 1
    g.bindShow('.modal-overlay', isOpen, 'flex');
    
    // 🌟 BẢN VÁ: Truyền thẳng tất cả các mảnh ghép vào bindText
    // Engine sẽ tự động decode ID -> String và nối chúng lại ở tốc độ ánh sáng!
    g.bindText('#modal-msg', "Bạn không thể thêm ", msg, " nữa vì đã hết hàng trong kho.");

    // Cổng nhận tín hiệu từ các ProductItem
    const triggerAction = g.action({ shouldOpen: g.i32, productName: g.str }, (tx, inputs) => {
        // Nếu shouldOpen == 1 -> Gán isOpen = 1. Nếu == 0 -> Giữ nguyên trạng thái cũ.
        const nextState = g.if(inputs.shouldOpen).return(1).else(isOpen);
        // Cập nhật thông báo nếu được phép mở
        const nextMsg = g.if(inputs.shouldOpen).return(inputs.productName).else(msg);
        
        tx.access(isOpen).set(nextState);
        tx.access(msg).set(nextMsg);
    });
    g.exportAction('TRIGGER_ACTION', triggerAction);

    // Hành động đóng Modal
    const closeAction = g.action({}, (tx) => {
        tx.access(isOpen).set(0);
    });
    g.onClick('.btn-close-modal', closeAction);
});

// ==========================================
// COMPONENT 2: GIỎ HÀNG THÔNG MINH (Tính toán phức tạp)
// ==========================================
const Cart = blueprint('Cart', (g) => {
    // State cơ bản
    const totalQty = g.state(g.i32, 0);
    const subTotal = g.state(g.i32, 0);
    const promoCode = g.state(g.str, ""); // State lưu chuỗi do người dùng gõ

    // 1. Two-way binding cho ô nhập mã khuyến mãi
    g.bindInput('#promo-input', promoCode);

    // 2. STRESS TEST LUẬT NGHIỆP VỤ (BUSINESS LOGIC)
    // Engine DOD sẽ so sánh chuỗi ở tốc độ O(1) nhờ String Interning!
    const isVipCode = g.eq(promoCode, "VIP2026");
    const isFreeShip = g.eq(promoCode, "FREESHIP");

    // Tính tiền khuyến mãi bằng ConditionChain (Exhaustive Pattern Matching)
    // VIP2026: Giảm 20% tổng bill (ÉP KIỂU KẾT QUẢ VỀ I32 ĐỂ CẮT BỎ SỐ THẬP PHÂN)
    // FREESHIP: Giảm cứng 30.000 đ
    // Còn lại: Giảm 0 đ
    const discountAmt = g.if(isVipCode).return( g.cast(g.div(g.mul(subTotal, 20), 100), g.i32) )
                         .elseif(isFreeShip).return( 30000 )
                         .else( 0 );

    // Khuyến mãi không được vượt quá Subtotal (Tránh âm tiền)
    const safeDiscount = g.min(discountAmt, subTotal);

    // MẸO: Tương tự, Tiền VAT cũng là phép chia, bạn nên ép kiểu về I32 
    // để tiền VNĐ không bị lẻ ra số thập phân (Ví dụ: 1205.5 VNĐ)
    const priceAfterDiscount = g.sub(subTotal, safeDiscount);
    const vatAmt = g.cast(g.div(g.mul(priceAfterDiscount, 8), 100), g.i32);

    // TỔNG TIỀN CUỐI CÙNG
    const finalTotal = g.add(priceAfterDiscount, vatAmt);

    // 3. Xả điện ra màn hình
    g.bindText('#cart-qty', totalQty);
    g.bindText('#cart-subtotal', subTotal, " đ");
    g.bindText('#cart-discount', safeDiscount, " đ");
    g.bindText('#cart-vat', vatAmt, " đ");
    g.bindText('#cart-final', finalTotal, " đ");

    // Chỉ hiện nút Thanh toán nếu có món hàng (totalQty > 0)
    g.bindShow('#btn-checkout', g.gt(totalQty, 0), 'block');

    // 4. Mở cổng RPC nhận lệnh từ Sản phẩm
    const addItemAction = g.action({ qty: g.i32, price: g.i32 }, (tx, { qty, price }) => {
        // Cộng dồn Số lượng
        tx.access(totalQty).update(val => g.add(val, qty));
        // Cộng dồn Tiền (subTotal += qty * price)
        tx.access(subTotal).update(val => g.add(val, g.mul(qty, price)));
    });
    g.exportAction('ADD_ITEM_ACTION', addItemAction);
});

// ==========================================
// COMPONENT 3: TRÌNH QUẢN LÝ
// ==========================================
const ShopManager = blueprint('ShopManager', (g) => {
    const initStore = g.action({}, (tx) => {
        // 🌟 BẢN VÁ: Truyền ID ảo (Chỉ đóng vai trò độ dài của list)
        tx.renderVirtualList('ProductItem', 'window.DB.ID', '#product-grid', 140, {
            // Mapping siêu tốc: Báo Engine nhét `rowIndex` vào cổng `ROW_INDEX`
            $index: 'ROW_INDEX' 
        });
    });
    g.onInit(initStore);
});

// ==========================================
// ĐÓNG GÓI VÀ XUẤT XƯỞNG
// ==========================================
buildApp({
    'body': ShopManager,
    '#product-grid': pool(ProductItem, 20),
    '#cart-widget': Cart,
    // 🌟 KHAI BÁO BẰNG CÚ PHÁP LAZY: Mount vào #modal-container, lấy khuôn từ #modal-tpl
    '#modal-container': lazy(PopupModal, '#modal-tpl') 
}, './app_compiled.js')