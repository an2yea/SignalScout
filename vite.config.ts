import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// ... existing code ...
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://signalscout.onrender.com',
          changeOrigin: true,
        },
      },
    },
  });
  