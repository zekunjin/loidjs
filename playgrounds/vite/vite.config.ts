import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { unpluginFileBasedRouter } from '../../packages/common/dist'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unpluginFileBasedRouter.vite()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
