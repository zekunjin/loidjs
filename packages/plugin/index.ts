import { createUnplugin } from 'unplugin'
import { isString } from '@loidjs/shared'

export interface FileBasedRouterOptions {
  glob?: string | string[]
}

export const importFileBasedRoutesRE = /import\s\w+\sfrom\s(\'|\")~views(\'|\")/g

export const unpluginFileBasedRouter = createUnplugin((options: FileBasedRouterOptions = { glob: ['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*'] }) => {
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
