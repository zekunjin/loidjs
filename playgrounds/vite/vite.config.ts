import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { unpluginFileBasedRouter } from '../../packages/common'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unpluginFileBasedRouter.vite()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@loidjs/common': resolve(__dirname, '../../packages/common')
    }
  }
})
