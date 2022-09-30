import { dirname, resolve as r, relative } from 'path'
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { findStaticImports, resolve } from 'mlly'

export interface FileBasedRouterOptions {
  glob?: string | string[]
  pageDir?: string
}

export const IGNORE_GLOB = ['!**/components/**/*', '!**/_*', '!**/.*']

export const importFileBasedRoutesRE = /import\s*(.*)\s*from\s*(?:\'|\")~([a-zA-Z]*)(?:\'|\");?/

export const unpluginFileBasedRouter = createUnplugin((options?: FileBasedRouterOptions) => {
  if (!options)
    options = { glob: [] }

  return {
    name: 'unplugin-file-based-router',

    transformInclude: id => /.*src.*\.(ts|js)/.test(id),

    async transform(code, id) {
      if (!code.match(importFileBasedRoutesRE))
        return { code }

      const s = new MagicString(code)
      const [_, importedVar, importedFrom] = code.match(importFileBasedRoutesRE)

      const staticImports = findStaticImports(code)
        .map((match) => {
          s.remove(match.start, match.end)
          return match.code
        })
        .filter(str => !str.match(importFileBasedRoutesRE))

      const [from, to] = await Promise.all([resolve(id), resolve('@loidjs/core', { url: await resolve(__dirname) })])
      const path = relative(dirname(from), dirname(r(to, '..'))).replace(/\\/g, '/')

      staticImports.push(`import { generateRoutesFromFiles } from "${path}";\n`)

      const globStr = JSON.stringify([`@/${importedFrom}/**/*.vue`, ...IGNORE_GLOB, ...[options.glob].flat()])

      const preVars = [`const ${importedVar} = generateRoutesFromFiles(import.meta.glob(${globStr}))\n`]

      s.prepend([...staticImports, ...preVars].join(''))

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    }
  }
})
