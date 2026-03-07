import fs from 'fs';
import { blueprint, buildApp, pool } from './framework_v44.js';

// =========================================
// 1. COMPONENT THẺ SHOP (G2 CARD)
// =========================================
const ShopCard = blueprint('ShopCard', (g) => {
    const props = g.defineProps({
        rowIndex: { port: 'ROW_INDEX', type: g.i32, default: -1 },
        minScoreFilter: { port: 'MIN_SCORE', type: g.f64, default: 0.0 }, // Cổng nhận số thực (Float64)
    });

    const shopName = g.globalRead('window.DB.NAME', props.rowIndex, g.str);
    const trustScore = g.globalRead('window.DB.TRUST_SCORE', props.rowIndex, g.f64);
    const totalReviews = g.globalRead('window.DB.TOTAL_REVIEWS', props.rowIndex, g.i32);
    const packedStats = g.globalRead('window.DB.PACKED_STATS', props.rowIndex, g.i32);

    // 🌟 RUST BITMASK DOD: Giải nén Khen và Chê trong 1 xung nhịp
    const goodReviews = g.bitAnd(packedStats, 0xFFFF);     // Đọc 16 bit đầu
    const badReviews = g.rshift(packedStats, 16);          // Dịch phải 16 bit lấy phần sau

    // 🌟 RUST FLOAT MATH: Tính % tiến trình Hài lòng
    const goodRatio = g.div(g.cast(goodReviews, g.f64), g.cast(totalReviews, g.f64));
    const goodRatioPercent = g.mul(goodRatio, g.cast(100, g.f64));

    // 🌟 2. SỬA 2 DÒNG NÀY: Ép kiểu 8.0 và 5.0 thành F64 để so sánh với trustScore
    const isTrusted = g.gte(trustScore, g.cast(8, g.f64));
    const isWarning = g.lt(trustScore, g.cast(5, g.f64));
    const isNormal = g.and(g.not(isTrusted), g.not(isWarning));
    
    // Cảnh báo nếu số review 1 sao chiếm > 20% (badReviews * 5 > totalReviews)
    const hasManyBadReviews = g.gt(g.mul(badReviews, 5), totalReviews);
    const isTopTier = g.and(isTrusted, g.gt(totalReviews, 5000));

    // LỌC: Ẩn/Hiện thẻ dựa trên điểm tối thiểu
    const isVisible = g.gte(trustScore, props.minScoreFilter);

    const viewDetailsAction = g.action({}, (tx) => {
        tx.callJS('alert', "Mở Modal tải hàng ngàn review chi tiết của Shop này!");
    });

    // BINDING AST HTML
    const compiledHtml = g.parseTemplateFile('./templates/shop-card.html', {
        isVisible, 
        shopName, 
        trustScoreText: [trustScore], 
        totalReviewsText: [totalReviews],
        isTrusted, isWarning, isNormal, hasManyBadReviews, isTopTier,
        goodRatioText: [goodRatioPercent],
        viewDetailsAction
    });

    g.exportSSG(compiledHtml); 
});

// =========================================
// 2. COMPONENT QUẢN LÝ NỀN TẢNG
// =========================================
const PlatformManager = blueprint('PlatformManager', (g) => {
    // State lưu điểm tối thiểu người dùng đang kéo (Mặc định 0.0)
    const minScoreState = g.state(g.f64, 0.0);
    
    // Gắn vào giao diện
    g.bindInput('#score-slider', minScoreState);
    g.bindText('#min-score-lbl', minScoreState);

    // Khởi tạo Lưới cuộn ảo Virtual Scroll (20 Card gánh 50.000 Shop)
    const initStore = g.action({}, (tx) => {
        tx.renderVirtualList('ShopCard', 'window.DB.NAME', '#shop-grid', 180, {
            $index: 'ROW_INDEX' 
        });
    });
    g.onInit(initStore);

    // Đánh chặn sự thay đổi của thanh trượt
    g.onInput('#score-slider', g.action({ newVal: g.f64 }, (tx, { newVal }) => {
        tx.access(minScoreState).set(newVal); 
        // Bắn dòng điện qua JS gọi 20 thẻ ShopCard thức dậy
        tx.callJS('broadcastMinScore', newVal);
    }), { newVal: 'value' }); 
});

// ==============================================================
// 3. BULD ỨNG DỤNG BẰNG KIẾN TRÚC MỚI (CỰC KỲ ĐƠN GIẢN)
// ==============================================================
buildApp({
    // Đăng ký toàn bộ Component vào đây
    components: [PlatformManager, ShopCard], 
    
    // File cấu hình
    template: './templates/index.html',
    outHtml: './public/index.html',
    outJs: './public/app_compiled.js'
});