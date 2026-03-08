import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

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
        topLevelAwait()
    ],
    server: {
        open: true,
        port: 3000
    }
});