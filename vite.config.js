// vite.config.js
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
    // Chỉ định thư mục public của chúng ta làm gốc (Nơi chứa index.html)
    root: 'src', 
    
    // Thư mục chứa các file build tĩnh cho production (Ví dụ: đưa lên Vercel)
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        target: 'esnext' // Hỗ trợ ES Modules và WebAssembly hiện đại
    },

    // Kích hoạt Plugin WASM để đọc file từ thư mục pkg của Rust
    plugins: [
        wasm(),
        topLevelAwait()
    ],

    server: {
        open: true, // Tự động mở trình duyệt khi chạy
        port: 3000
    }
});