import type { App } from 'vue'

type PluginInstallFunction = (app: App, ...options: any[]) => any

interface FlatArrayKeyOptions {
  key: string
  parentKey: string
}

export const isString = (val: any): val is string => typeof val === 'string'

export const transferFlatArrayToTreeArray = <T>(arr: Record<string, any>[], options: FlatArrayKeyOptions = { key: 'id', parentKey: 'pid' }): T[] => {
  const tree: any[] = []
  const rows: Record<string, any> = {}

  arr.forEach((item) => {
    rows[useChain(item)?.[options.key]] = item
    const parent = useChain(item)?.[options.parentKey]
    if (!parent) tree.push(item)
    else {
      if (!rows[parent].children) rows[parent].children = []
      rows[parent].children.push(rows[useChain(item)?.[options.key]])
    }
  })

  return tree
}

export const useChain = (target: Record<string, any>) => {
  return new Proxy(target, {
    get: (target, key: string) => {
      const keys = key.split('.')
      return keys.reduce((a, b) => a?.[b], target)
    }
  })
}

export const useVuePlugin = (install: PluginInstallFunction) => ({ install })
