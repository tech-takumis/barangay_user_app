import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/uploads': {
                target: 'http://localhost:8000',  // Your Laravel backend
                changeOrigin: true,               // Ensures proper Host header is sent
                rewrite: (path) => path.replace(/^\/uploads/, '/uploads'), // Optional: Adjust path if needed
              },
              '/api': {
                target: 'http://localhost:8000',  // Backend API
                changeOrigin: true,
                secure: false, // Set to true if you are using https
              },
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [vue()],
})
