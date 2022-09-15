import { createRouter, createWebHistory, RouteComponent } from 'vue-router'
import { generateRoutesFromFiles } from '@loidjs/core'
import type { App } from 'vue'
import type { Router as VueRouter } from 'vue-router'

interface PageMeta {
  title?: string
  pageTransition?: boolean
  layoutTransition?: boolean
  key?: false | string
  keepalive?: boolean
  layout?: false
  [key: string]: any
}

export const router = {
  install(app: App, callback: (router: VueRouter) => void) {
    const files = import.meta.glob(['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*'])
    const routes = generateRoutesFromFiles(files as Record<string, () => Promise<RouteComponent>>)

    const router = createRouter({
      history: createWebHistory(),
      routes
    })

    app.use(router)
    callback(router)
  }
}

export const definePageMeta = (meta: PageMeta) => {
  if (meta.title) document.title = meta.title
}

export { VueRouter }
