// ==========================================
// TẦNG RENDER ĐỒ HỌA (TEXTURE MANAGER)
// ==========================================
export class TextureManager {
    static cache = new Map(); // Nơi lưu trữ Bitmap
    static loading = new Set();
    
    static init() {
        // Vòng lặp Render độc lập (Đồng bộ với tần số quét của màn hình)
        const renderLoop = () => {
            const canvases = document.getElementsByClassName('product-canvas');
            const texIds = document.getElementsByClassName('tex-id');
            
            for (let i = 0; i < canvases.length; i++) {
                const canvas = canvases[i];
                const idStr = texIds[i].textContent;
                if (!idStr) continue;
                
                const id = parseInt(idStr, 10);
                
                // Chỉ vẽ lại nếu ID bị thay đổi do Virtual Scroll
                if (canvas._lastId !== id) {
                    canvas._lastId = id;
                    const ctx = canvas.getContext('2d', { alpha: false }); // alpha:false tắt trong suốt giúp tăng tốc độ render GPU
                    
                    if (this.cache.has(id)) {
                        // Ảnh đã có trong VRAM -> Vẽ siêu tốc O(1)
                        ctx.drawImage(this.cache.get(id), 0, 0, 80, 80);
                    } else {
                        // Xóa khung cũ thành nền xám
                        ctx.fillStyle = '#f1f5f9';
                        ctx.fillRect(0, 0, 80, 80);
                        
                        // Nạp ngầm hình ảnh
                        this.preload(id, canvas);
                    }
                }
            }
            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);
    }
    
    static async preload(id, canvas) {
        if (this.loading.has(id)) return;
        this.loading.add(id);
        
        try {
            // 🌟 THUẬT TOÁN DEBOUNCE: Chờ 50ms xem user có đang lướt nhanh quá không
            await new Promise(r => setTimeout(r, 50));
            // Nếu ID của Canvas đã đổi (Tức là user lướt qua luôn rồi), Hủy tải ngay lập tức!
            if (canvas._lastId !== id) return; 

            // Tải ảnh ngẫu nhiên từ Picsum
            const res = await fetch(`https://picsum.photos/seed/${id}/80/80`);
            const blob = await res.blob();
            
            // Giải mã ảnh thành Bitmap siêu tốc ở một luồng Background
            const bitmap = await createImageBitmap(blob);
            this.cache.set(id, bitmap);
            
            // 🌟 QUẢN LÝ BỘ NHỚ CƠ HỌC: Nếu vượt 500 ảnh, Xóa ảnh cũ nhất khỏi VRAM!
            if (this.cache.size > 500) {
                const firstKey = this.cache.keys().next().value;
                const oldBitmap = this.cache.get(firstKey);
                if (oldBitmap && oldBitmap.close) oldBitmap.close(); // Chặn đứng Memory Leak
                this.cache.delete(firstKey);
            }
            
            // Đánh dấu canvas cần vẽ lại ở frame tiếp theo
            if (canvas._lastId === id) canvas._lastId = null; 
            
        } catch (e) {
            // Lỗi mạng, bỏ qua
        } finally {
            this.loading.delete(id);
        }
    }
}

// ==============================================
// 🌟 HỆ THỐNG HẠT GIAO DIỆN (UI PARTICLE SYSTEM)
// ==============================================
export class ParticleManager {
    static pool = [];
    static poolSize = 10;
    static currentIndex = 0;
    static targetRect = null;

    static init() {
        // 1. Pre-allocate (Cấp phát trước) 10 Canvas Hạt vào DOM
        for (let i = 0; i < this.poolSize; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            canvas.className = 'particle';
            document.body.appendChild(canvas);
            this.pool.push(canvas);
        }

        // 2. Lắng nghe cú click Toàn cục (Tách bạch khỏi Logic Engine)
        document.addEventListener('click', (e) => {
            // Chỉ kích hoạt nếu bấm vào nút "Thêm vào giỏ" và nút đó CHƯA bị khóa (còn hàng)
            if (e.target.classList.contains('btn-buy') && !e.target.classList.contains('btn-disabled')) {
                // Tìm thẻ Canvas của chính sản phẩm đó
                const card = e.target.closest('.product-card');
                const sourceCanvas = card ? card.querySelector('.product-canvas') : null;
                
                this.spawn(e.clientX, e.clientY, sourceCanvas);
            }
        });
    }

    static spawn(startX, startY, sourceCanvas) {
        // Lấy tọa độ Giỏ hàng đích đến (Chỉ lấy 1 lần rồi Cache lại)
        if (!this.targetRect) {
            const cartEl = document.getElementById('cart-qty');
            if (cartEl) this.targetRect = cartEl.getBoundingClientRect();
        }

        // 3. Bốc 1 Hạt từ Bể chứa (Object Pooling)
        const particle = this.pool[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.poolSize;

        // 4. Reset Hạt về vị trí chuột (Tắt transition để dịch chuyển tức thời)
        particle.classList.remove('flying');
        particle.style.transform = `translate(${startX - 30}px, ${startY - 30}px) scale(1)`;
        particle.style.opacity = '1';

        // 5. Zero-Allocation VRAM Copy: Đổ mực từ ảnh gốc sang Hạt
        const ctx = particle.getContext('2d', { alpha: false });
        if (sourceCanvas) {
            ctx.drawImage(sourceCanvas, 0, 0, 60, 60);
        } else {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(0, 0, 60, 60);
        }

        // 6. Ép trình duyệt vẽ lại khung hình (Reflow) để chốt vị trí Start
        void particle.offsetWidth; 

        // 7. Kích hoạt bay vào giỏ hàng
        particle.classList.add('flying');
        
        const endX = this.targetRect ? this.targetRect.left - 15 : window.innerWidth - 100;
        const endY = this.targetRect ? this.targetRect.top - 15 : 50;
        
        // Hạt thu nhỏ dần và mờ đi khi chui vào giỏ
        particle.style.transform = `translate(${endX}px, ${endY}px) scale(0.2)`;
        particle.style.opacity = '0';
    }
}