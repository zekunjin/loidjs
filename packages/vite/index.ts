import { createRouter, createWebHistory, RouteComponent } from 'vue-router'
import { generateRoutesFromFiles } from '@loidjs/core'
import type { App } from 'vue'
import type { Router as VueRouter } from 'vue-router'

export const router = {
  install(app: App, callback: (router: VueRouter) => void) {
    const files = import.meta.glob(['@/views/**/*.vue', '!**/components/**/*.vue', '!**/_*.vue', '!**/.*.vue']) as Record<string, () => Promise<RouteComponent>>
    const routes = generateRoutesFromFiles(files)

    const router = createRouter({
      history: createWebHistory(),
      routes
    })

    app.use(router)
    callback(router)
  }
}

export { VueRouter }
