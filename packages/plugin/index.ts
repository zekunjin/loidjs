import { createUnplugin } from 'unplugin'
// import fg from 'fast-glob'

export interface FileBasedRouterOptions {
  mode: 'hash' | 'history'
}

export const createAppRE = /\bcreateApp(?:(\w+))/g

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
