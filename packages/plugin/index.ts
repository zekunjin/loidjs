import { createUnplugin } from 'unplugin'
// import MagicString from 'magic-string'
import { isString } from '@loidjs/shared'

export interface FileBasedRouterOptions {
  glob?: string | string[]
}

export const DEFAULT_GLOB = ['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*']

export const importFileBasedRoutesRE = /import\s\w+\sfrom\s(\'|\")~views(\'|\");?/g
export const importRE = /import\s.*\sfrom\s(\'|\").*(\'|\");?/g

export const unpluginFileBasedRouter = createUnplugin((options: FileBasedRouterOptions = { glob: DEFAULT_GLOB }) => {
  return {
    name: 'unplugin-file-based-router',
    transformInclude: (id) => /.*src.*\.(ts|js)/.test(id),
    transform(code) {
      if (!code.match(importFileBasedRoutesRE)) return { code }

      const staticImports = Array.from(code.matchAll(importRE))
        .map(([str]) => str)
        .filter((str) => str.indexOf('~views') < 0)

      if (!options.glob) return { code: code.replace(importFileBasedRoutesRE, 'const routes = []') }

      console.log(staticImports)

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

export const resolveAlias = (path: string) => {}
