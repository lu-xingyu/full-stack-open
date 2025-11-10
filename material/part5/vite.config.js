import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',   // 当浏览器访问的 URL 以 /api 开头 时，Vite 不再自己处理这个请求，而是把它转发（代理）给另一台服务器 —— 在这里就是 http://localhost:3001
        changeOrigin: true,
      },
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.jsx'],
      all: true
    }
  } 
})
