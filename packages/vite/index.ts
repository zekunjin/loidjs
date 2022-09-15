import { createRouter, createWebHistory } from 'vue-router'
import { generateRoutesFromFiles } from '@loidjs/core'
import type { App } from 'vue'
import type { Router as VueRouter, RouteComponent } from 'vue-router'

type ImportVueGlobFunction = Record<string, () => Promise<RouteComponent>>

interface PageMeta {
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
    const routes = generateRoutesFromFiles(files as ImportVueGlobFunction)

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
