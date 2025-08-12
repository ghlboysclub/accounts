import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          utils: ['axios', 'lucide-react', 'react-hot-toast', 'js-cookie']
        }
      }
    }
  },
  define: {
    // For production API URL
    __API_BASE_URL__: JSON.stringify('https://accounts-api.ghlboysclub.workers.dev')
  }
})