import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // or jsdom
    setupFiles: './tests/setup.js'
  },
  server: {
    proxy: {
      '/api': {
        target: 'localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
