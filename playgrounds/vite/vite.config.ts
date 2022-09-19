import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { vitePluginVueFileBasedRouter } from '../../packages/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vitePluginVueFileBasedRouter({ mode: 'history' })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@loidjs/core': resolve(__dirname, '../../packages/core')
    }
  }
})
