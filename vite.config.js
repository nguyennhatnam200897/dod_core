// vite.config.js
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
    root: 'src', // 🌟 Đổi từ 'public' thành 'src'
    publicDir: '../public', // 🌟 Khai báo thư mục public nằm bên ngoài root
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        target: 'esnext'
    },
    plugins: [
        wasm(),
        topLevelAwait()
    ],
    server: {
        open: true,
        port: 3000
    }
});