import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://orange-goldfish-5gx9x65qv5g62vq9-4000.app.github.dev/'
    }
  }
})
