import { createApp } from 'vue'
import { router } from '@loidjs/vite'
import type { VueRouter } from '@loidjs/vite'
import App from './App.vue'

const app = createApp(App)

app.use(router, (ctx: VueRouter) => {
  ctx.beforeEach((to, from, next) => {
    next()
  })
})

app.mount('#app')
