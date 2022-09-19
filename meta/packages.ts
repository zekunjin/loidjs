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

export const packages: PackageManifest[] = [
  { name: 'core', display: 'loidjs', build: true, external: ['@loidjs/router'], globals: { '@loidjs/router': 'LoidRouter' } },
  { name: 'router', display: 'loidjs', build: true, external: ['vue-router', '@loidjs/shared'], globals: { 'vue-router': 'VueRouter', '@loidjs/shared': 'LoidShared' } },
  { name: 'shared', display: 'loidjs', build: true, external: ['vue'], globals: { vue: 'Vue' } }
]
