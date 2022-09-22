import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { resolve, findStaticImports } from 'mlly'
import { dirname, relative, resolve as r } from 'path'
import { isString } from '@loidjs/shared'

export interface FileBasedRouterOptions {
  glob?: string | string[]
  pageDir?: string
}

export const DEFAULT_GLOB = ['!**/components/**/*', '!**/_*', '!**/.*']

export const importFileBasedRoutesRE = /import\s*(.*)\s*from\s*(?:\'|\")~([a-zA-Z]*)(?:\'|\");?/

export const unpluginFileBasedRouter = createUnplugin((options: FileBasedRouterOptions = { glob: DEFAULT_GLOB }) => {
  return {
    name: 'unplugin-file-based-router',

    transformInclude: (id) => /.*src.*\.(ts|js)/.test(id),

    async transform(code, id) {
      if (!code.match(importFileBasedRoutesRE)) return { code }

      const s = new MagicString(code)
      const [_, importedVar, importedFrom] = code.match(importFileBasedRoutesRE)

      const staticImports = findStaticImports(code)
        .map((match) => {
          s.remove(match.start, match.end)
          return match.code
        })
        .filter((str) => !str.match(importFileBasedRoutesRE))

      const [from, to] = await Promise.all([resolve(id), resolve('@loidjs/core', { url: await resolve(__dirname) })])
      const path = relative(dirname(from), dirname(r(to, '..'))).replace(/\\/g, '/')

      staticImports.push(`import { generateRoutesFromFiles } from "${path}";\n`)

      const globStr = isString(options.glob) ? options.glob : JSON.stringify([`@/${importedFrom}/**/*.vue`, ...options.glob])

      const preVars = [`const ${importedVar} = generateRoutesFromFiles(import.meta.glob(${globStr}))\n`]

      s.prepend([...staticImports, ...preVars].join(''))

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    }
  }
})
