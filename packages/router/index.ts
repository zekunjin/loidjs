import type { RouteComponent, RouteRecordRaw } from 'vue-router'

const DEFAULT_FILE_NAME = 'index'

export const generateRoutesFromFiles = (files: Record<string, () => Promise<RouteComponent>>): RouteRecordRaw[] => {
  const routeRecord: Record<string, RouteRecordRaw> = {}
  const routeArray: RouteRecordRaw[] = []
  const routes: RouteRecordRaw[] = []
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
      component,
      meta: { parent: segments.slice(0, segments.length - 1).join('/') },
      children: []
    })
  })

  routeArray.forEach((route) => {
    routeRecord[route.path] = route
  })

  routeArray.forEach(({ path, component, children, meta = {} }) => {
    const parent = (meta.parent as string) || ''
    if (!parent) routes.push({ path, component, children } as RouteRecordRaw)
    else (routeRecord[parent].children as RouteRecordRaw[]).push(routeRecord[path])
  })

  return routes
}
