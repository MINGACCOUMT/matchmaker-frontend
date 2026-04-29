import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://matchmaker-api-bi2k.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  preview: {
    allowedHosts: ['.onrender.com']
  }
})
