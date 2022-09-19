import { createUnplugin } from 'unplugin'
import type { RouterOptions } from 'vue-router'

export const createAppRE = /\bcreateApp(?:(\w+))/g

export const unpluginFileBasedRouter = createUnplugin((options: RouterOptions) => {
  return {
    name: 'unplugin-file-based-router',
    transform(code, id) {
      const matches = Array.from(code.matchAll(createAppRE))

      const str = `
        .use(() => import('vue-router').createRouter({ history: () => import('vue-router').createWebHistory(), routes: generateRoutesFromFiles(import.meta.glob()) }))
      `
      return code
    }
  }
})
