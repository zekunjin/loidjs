import { calcFlatArrayToTreeArray } from '@loidjs/shared'
import type { RouteComponent, RouteRecordRaw } from 'vue-router'

const DEFAULT_FILE_NAME = 'index'

export const generateRoutesFromFiles = (files: Record<string, () => Promise<unknown>>): RouteRecordRaw[] => {
  const routeArray: RouteRecordRaw[] = []
  const exclude = ['src', 'views', DEFAULT_FILE_NAME]

  Object.entries(files).forEach(([path, component]) => {
    const segments = path
      .replace(/.vue?/, '')
      .replace(/\[([\w-]+)]/, ':$1')
      .split('/')
      .filter((path) => !exclude.includes(path))
      .filter(Boolean)

    segments.unshift('')

    routeArray.push({
      path: segments.join('/'),
      component: component as () => Promise<RouteComponent>,
      meta: { parent: segments.slice(0, segments.length - 1).join('/') },
      children: []
    })
  })

  const routes = calcFlatArrayToTreeArray<RouteRecordRaw>(routeArray, { key: 'path', parentKey: 'meta.parent' })

  return routes
}
