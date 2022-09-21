interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
  submodules?: boolean
  build?: boolean
  iife?: boolean
  cjs?: boolean
  mjs?: boolean
  dts?: boolean
  target?: string
  utils?: boolean
  copy?: string[]
}

export const GLOBAL_EXTERNAL = ['vue', 'vue-router', 'unplugin', 'magic-string', '@loidjs/shared']

export const IIFE_GLOBALS = { vue: 'Vue', 'vue-router': 'VueRouter', unplugin: 'Unplugin', 'magic-string': 'MagicString', '@loidjs/shared': 'LoidShared' }

export const packages: PackageManifest[] = [
  { name: 'core', display: 'loidjs', build: true, external: GLOBAL_EXTERNAL, globals: IIFE_GLOBALS },
  { name: 'shared', display: 'loidjs', build: true, external: GLOBAL_EXTERNAL, globals: IIFE_GLOBALS },
  { name: 'common', display: 'loidjs', build: true, external: GLOBAL_EXTERNAL, globals: IIFE_GLOBALS }
]
