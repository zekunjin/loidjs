import { transferFlatArrayToTreeArray } from '@loidjs/shared'
import type { RouteComponent, RouteRecordRaw } from 'vue-router'

const DEFAULT_FILE_NAME = 'index'

export type ImportGlobFunction = Record<string, () => Promise<unknown>>

export const generateRoutesFromFiles = (files: ImportGlobFunction): RouteRecordRaw[] => {
  const routeArray: RouteRecordRaw[] = []
  const exclude = ['.', '@', 'src', 'views', DEFAULT_FILE_NAME]

  Object.entries(files).forEach(([path, component]) => {
    const segments = path
      .replace(/.vue?/, '')
      .replace(/\[([\w-]+)]/g, ':$1')
      .split('/')
      .filter((path) => !exclude.includes(path))
      .filter(Boolean)

    segments.unshift('')

    routeArray.push({
      path: segments.join('/'),
      props: true,
      component: component as () => Promise<RouteComponent>,
      meta: { parent: segments.slice(0, segments.length - 1).join('/') }
    })
  })

  return transferFlatArrayToTreeArray<RouteRecordRaw>(routeArray, { key: 'path', parentKey: 'meta.parent' })
}
