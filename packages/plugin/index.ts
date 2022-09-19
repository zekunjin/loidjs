import { createUnplugin } from 'unplugin'
// import fg from 'fast-glob'

export interface FileBasedRouterOptions {
  mode: 'hash' | 'history'
}

export const createAppRE = /\bcreateApp(?:(\w+))/g

export const unpluginFileBasedRouter = createUnplugin((options?: FileBasedRouterOptions) => {
  console.log('==========  unplugin file based router ==========')
  console.log(options)

  return {
    name: 'unplugin-file-based-router',
    transformInclude: () => true,
    async transform(code) {
      return code
    }
  }
})

export const vitePluginVueFileBasedRouter = unpluginFileBasedRouter.vite
