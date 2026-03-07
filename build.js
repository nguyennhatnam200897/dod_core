import fs from 'fs';
import { blueprint, buildApp, pool } from './framework_v44.js';

// =========================================
// 1. COMPONENT THẺ SHOP (G2 CARD)
// =========================================
const ShopCard = blueprint('ShopCard', (g) => {
    const props = g.defineProps({
        rowIndex: { port: 'ROW_INDEX', type: g.i32, default: -1 },
        minScoreFilter: { port: 'MIN_SCORE', type: g.f64, default: 0.0 }, // Cổng nhận số thực (Float64)
        offsetY: { port: 'TRANSFORM_Y', type: g.i32, default: -9999 }
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
    const goodRatioPercent = g.mul(goodRatio, 100.0);

    // Rẽ nhánh trạng thái Huy hiệu (Badge)
    const isTrusted = g.gte(trustScore, 8.0);
    const isWarning = g.lt(trustScore, 5.0);
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
        isVisible, offsetY, shopName, 
        trustScoreText: [trustScore], 
        totalReviewsText: [totalReviews],
        isTrusted, isWarning, isNormal, hasManyBadReviews, isTopTier,
        goodRatioText: [goodRatioPercent],
        viewDetailsAction
    });

    global.SHOP_CARD_HTML = compiledHtml; 
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
        tx.renderVirtualList('ShopCard', 'window.DB.ID', '#shop-grid', 180, {
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

// 3. BUILD VÀ TIÊM SSG
buildApp({
    'body': PlatformManager,
    '.shop-wrapper': pool(ShopCard, 20) 
}, './public/app_compiled.js');

console.log("💉 Đang tiêm giao diện G2 Review vào index.html...");
let indexHtml = fs.readFileSync('./public/index.html', 'utf-8');
indexHtml = indexHtml.replace(
    /<div class="shop-wrapper"><\/div>/g, 
    `<div class="shop-wrapper absolute w-full left-0 pr-6">\n${global.SHOP_CARD_HTML}\n</div>`
);
fs.writeFileSync('./public/index.html', indexHtml);
console.log("✅ Tiêm SSG hoàn tất!");