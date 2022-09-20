import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import fileBasedRoutes from '~views'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: fileBasedRoutes
})

const app = createApp(App)

app.use(router).mount('#app')
