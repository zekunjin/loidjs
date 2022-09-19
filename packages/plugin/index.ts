import { createUnplugin } from 'unplugin'
// import fg from 'fast-glob'
import type { RouterOptions } from 'vue-router'

export const createAppRE = /\bcreateApp(?:(\w+))/g

export const unpluginFileBasedRouter = createUnplugin((options?: RouterOptions) => {
  return {
    name: 'unplugin-file-based-router',
    transformInclude: (id) => id.indexOf('main') > -1,
    async transform(code) {
      console.log('==========  unplugin file based router ==========')

      // const entries = await fg(id, { dot: true })

      return code
    }
  }
})
