import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { generateRoutesFromFiles } from '@loidjs/core'
import App from './App.vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutesFromFiles(import.meta.glob(['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*']))
})

app.use(router).mount('#app')
