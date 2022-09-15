import { createRouter, createWebHistory, RouteComponent } from 'vue-router'
import { generateRoutesFromFiles } from '@loidjs/core'
import type { App } from 'vue'

export interface RouterOptions {
  base: string
  include: string[]
  exclude?: string[]
}

export const router = {
  install(app: App) {
    const files = import.meta.glob('@/views/**/*.vue') as Record<string, () => Promise<RouteComponent>>
    const routes = generateRoutesFromFiles(files)

    const router = createRouter({
      history: createWebHistory(),
      routes
    })

    app.use(router)
  }
}
