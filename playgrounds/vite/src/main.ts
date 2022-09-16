import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { generateRoutesFromFiles } from '@loidjs/core'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutesFromFiles(import.meta.glob(['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*']))
})

const app = createApp(App)

app.use(router).mount('#app')
