console.time("Sinh 50.000 Shop Data");
const TOTAL_SHOPS = 50000;
window.DB = {
    ID: new Int32Array(TOTAL_SHOPS),
    NAME: new Array(TOTAL_SHOPS),
    TRUST_SCORE: new Float64Array(TOTAL_SHOPS),
    TOTAL_REVIEWS: new Int32Array(TOTAL_SHOPS),
    PACKED_STATS: new Int32Array(TOTAL_SHOPS), // [16 bit: Khen] [16 bit: Chê]
};

const prefixes = ["Tổng kho", "Siêu thị", "Đại lý", "Official Store", "Xưởng", "Boutique"];
const niches = ["Điện máy", "Gia dụng", "Mẹ & Bé", "Mỹ phẩm", "Phụ kiện", "Thời trang"];

for (let i = 0; i < TOTAL_SHOPS; i++) {
    window.DB.ID[i] = i;
    window.DB.NAME[i] = `${prefixes[i % prefixes.length]} ${niches[i % niches.length]} #${i}`;
    
    // Giả lập từ 100 đến 10.000 đánh giá
    const total = 100 + Math.floor(Math.random() * 9900);
    window.DB.TOTAL_REVIEWS[i] = total;

    // Giả lập điểm tín nhiệm từ 2.0 đến 10.0
    const score = 2.0 + (Math.random() * 8.0);
    window.DB.TRUST_SCORE[i] = parseFloat(score.toFixed(1));

    // Tính số lượng khen/chê dựa trên điểm
    const goodReviews = Math.floor(total * (score / 10));
    const badReviews = total - goodReviews;

    // KỸ THUẬT RUST DOD: Nén Khen và Chê vào chung 1 số I32
    // Dịch trái badReviews 16 bit, cộng với goodReviews
    window.DB.PACKED_STATS[i] = (badReviews << 16) | goodReviews;
}
console.timeEnd("Sinh 50.000 Shop Data");