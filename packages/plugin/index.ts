import { createUnplugin } from 'unplugin'

export interface FileBasedRouterOptions {
  mode: 'hash' | 'history'
}

export const unpluginFileBasedRouter = createUnplugin((options?: FileBasedRouterOptions) => {
  return {
    name: 'unplugin-file-based-router',
    transformInclude: (id) => !!id.match(/main.(js|ts)/),
    transform(code) {
      console.log(code)
      return { code }
    }
  }
})
