// vite.config.js
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// 🌟 DOD ENGINE PLUGIN: Tự động biến HTML thành Chuỗi (Trừ index.html)
function dodHtmlLoader() {
    return {
        name: 'dod-html-string-loader',
        // Đánh chặn mã nguồn trước khi Vite xử lý
        transform(code, id) {
            // Nếu là file .html và KHÔNG phải là file index.html gốc
            if (id.endsWith('.html') && !id.endsWith('index.html')) {
                // Dùng JSON.stringify để xử lý an toàn mọi ký tự nháy kép ("), xuống dòng (\n)
                const safeString = JSON.stringify(code);
                
                // Trả về một Module ES6 hợp lệ
                return {
                    code: `export default ${safeString};`,
                    map: null // Không cần sourcemap cho HTML tĩnh
                };
            }
        }
    };
}

export default defineConfig({
    root: 'src', 
    publicDir: '../public', 
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        target: 'esnext'
    },
    plugins: [
        wasm(),
        topLevelAwait(),
        dodHtmlLoader() // 🌟 Tích hợp Plugin của Engine vào đây
    ],
    server: {
        open: true,
        port: 3000
    }
});