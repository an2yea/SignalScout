import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist'
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://nishitrl.app.n8n.cloud',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                secure: false,
            }
        }
    }
})
