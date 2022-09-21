import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { isString } from '@loidjs/shared'

export interface FileBasedRouterOptions {
  glob?: string | string[]
  pageDir?: string
}

export const DEFAULT_GLOB = ['@/views/**/*.vue', '!**/components/**/*', '!**/_*', '!**/.*']

export const importFileBasedRoutesRE = /import\s*(.*)\s*from\s*(\'|\")~views(\'|\");?/
export const importRE = /import\s*.*\s*from\s*(\'|\").*(\'|\");?/g

export const unpluginFileBasedRouter = createUnplugin((options: FileBasedRouterOptions = { glob: DEFAULT_GLOB }) => {
  return {
    name: 'unplugin-file-based-router',

    transformInclude: (id) => /.*src.*\.(ts|js)/.test(id),

    transform(code) {
      if (!code.match(importFileBasedRoutesRE)) return { code }

      const s = new MagicString(code)
      const importedVar = code.match(importFileBasedRoutesRE)[1] || 'routes'

      const staticImports = Array.from(code.matchAll(importRE))
        .map((match) => {
          s.remove(match.index, match.index + match[0].length)
          return match[0] as string
        })
        .filter((str) => str.indexOf('~views') < 0)

      staticImports.push('import { generateRoutesFromFiles } from "@loidjs/core";')

      const globStr = isString(options.glob) ? options.glob : JSON.stringify(options.glob)

      const preVars = [`const ${importedVar} = generateRoutesFromFiles(import.meta.glob(${globStr}))`]

      s.prepend([...staticImports, ...preVars].join('\n'))

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    }
  }
})

export const asyncCodeFuncWrap = (lib: string, module: string, ...params: any[]): string => {
  return `(await import('${lib}')).${module}(${JSON.stringify(params)})`
}

export const resolveAlias = (path: string) => {}
