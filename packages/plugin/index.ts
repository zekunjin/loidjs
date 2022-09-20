import { createUnplugin } from 'unplugin'
import { isString } from '@loidjs/shared'

export interface FileBasedRouterOptions {
  glob?: string | string[]
}

export const DEFAULT_GLOB = ['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*']

export const importFileBasedRoutesRE = /import\s\w+\sfrom\s(\'|\")~views(\'|\")/g

export const unpluginFileBasedRouter = createUnplugin((options: FileBasedRouterOptions = { glob: DEFAULT_GLOB }) => {
  return {
    name: 'unplugin-file-based-router',
    transformInclude: (id) => /.*src.*\.(ts|js)/.test(id),
    transform(code) {
      if (!options.glob) return { code: code.replace(importFileBasedRoutesRE, 'const routes =[]') }

      const generateRoutesFromFilesStr = "(await import('@loidjs/core')).generateRoutesFromFiles"

      const globStr = isString(options.glob) ? options.glob : JSON.stringify(options.glob)

      return {
        code: code.replace(importFileBasedRoutesRE, `const routes = ${generateRoutesFromFilesStr}(import.meta.glob(${globStr}))`)
      }
    }
  }
})

export const asyncCodeFuncWrap = (lib: string, module: string, ...params: any[]): string => {
  return `(await import('${lib}')).${module}(${JSON.stringify(params)})`
}
