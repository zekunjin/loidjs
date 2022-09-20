import { createUnplugin } from 'unplugin'

export interface FileBasedRouterOptions {}

export const importFileBasedRoutesRE = /import\s\w+\sfrom\s(\'|\")~views(\'|\")/g

export const unpluginFileBasedRouter = createUnplugin(() => {
  return {
    name: 'unplugin-file-based-router',
    transformInclude: (id) => /.*src.*\.(ts|js)/.test(id),
    transform(code) {
      const generateRoutesFromFilesStr = "(await import('@loidjs/core')).generateRoutesFromFiles"
      const paths = "['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*']"
      code = code.replace(importFileBasedRoutesRE, `const routes = ${generateRoutesFromFilesStr}(import.meta.glob(${paths}))`)

      return { code }
    }
  }
})
