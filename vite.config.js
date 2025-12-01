import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/products': {
        target: 'http://localhost:8282',
        changeOrigin: true,
        secure: false,
      },
      '/api/customers': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/api/authenticate': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/api/auth': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/api/Cart': {
        target: 'http://localhost:8182',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
