import { escapeRE } from '@loidjs/shared'
import { basename, extname } from 'pathe'
import type { RouteComponent, RouteRecordRaw } from 'vue-router'

enum SegmentParserState {
  initial,
  static,
  dynamic,
  optional,
  catchall
}

enum SegmentTokenType {
  static,
  dynamic,
  optional,
  catchall
}

interface SegmentToken {
  type: SegmentTokenType
  value: string
}

export type VueGlobFiles = Record<string, () => Promise<RouteComponent>>

const getRoutePath = (tokens: SegmentToken[]): string => {
  return tokens.reduce((path, token) => {
    return (
      path
      + (token.type === SegmentTokenType.optional
        ? `:${token.value}?`
        : token.type === SegmentTokenType.dynamic
          ? `:${token.value}`
          : token.type === SegmentTokenType.catchall
            ? `:${token.value}(.*)*`
            : token.value)
    )
  }, '/')
}

const PARAM_CHAR_RE = /[\w\d_.]/

export const parseSegment = (segment: string) => {
  let state: SegmentParserState = SegmentParserState.initial
  let i = 0

  let buffer = ''
  const tokens: SegmentToken[] = []

  function consumeBuffer() {
    if (!buffer)
      return

    if (state === SegmentParserState.initial)
      throw new Error('wrong state')

    tokens.push({
      type:
        state === SegmentParserState.static
          ? SegmentTokenType.static
          : state === SegmentParserState.dynamic
            ? SegmentTokenType.dynamic
            : state === SegmentParserState.optional
              ? SegmentTokenType.optional
              : SegmentTokenType.catchall,
      value: buffer
    })

    buffer = ''
  }

  while (i < segment.length) {
    const c = segment[i]

    switch (state) {
      case SegmentParserState.initial:
        buffer = ''
        if (c === '[') {
          state = SegmentParserState.dynamic
        }
        else {
          i--
          state = SegmentParserState.static
        }
        break

      case SegmentParserState.static:
        if (c === '[') {
          consumeBuffer()
          state = SegmentParserState.dynamic
        }
        else {
          buffer += c
        }
        break

      case SegmentParserState.catchall:
      case SegmentParserState.dynamic:
      case SegmentParserState.optional:
        if (buffer === '...') {
          buffer = ''
          state = SegmentParserState.catchall
        }
        if (c === '[' && state === SegmentParserState.dynamic)
          state = SegmentParserState.optional

        if (c === ']' && (state !== SegmentParserState.optional || buffer[buffer.length - 1] === ']')) {
          if (!buffer)
            throw new Error('Empty param')

          else
            consumeBuffer()

          state = SegmentParserState.initial
        }
        else if (PARAM_CHAR_RE.test(c)) {
          buffer += c
        }
        break
    }
    i++
  }

  if (state === SegmentParserState.dynamic)
    throw new Error(`Unfinished param "${buffer}"`)

  consumeBuffer()

  return tokens
}

export const generateRoutesFromFiles = (files: VueGlobFiles): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  const exclude = ['.', '@', 'src', 'views', '']

  Object.entries(files).forEach(([path, component]) => {
    const segments = path.replace(new RegExp(`${escapeRE(extname(basename(path)))}$`), '').split('/').filter(path => !exclude.includes(path))

    const route: RouteRecordRaw = {
      path: '',
      name: '',
      component,
      children: []
    }

    let parent = routes

    for (const segment of segments) {
      const tokens = parseSegment(segment)
      const segmentName = tokens.map(({ value }) => value).join('')
      const isSingleSegment = segments.length === 1

      route.name = (route.name as string) + (route.name && '-') + segmentName

      // ex: parent.vue + parent/child.vue
      const child = parent.find(parentRoute => parentRoute.name === route.name && !parentRoute.path.endsWith('(.*)*'))

      if (child && child.children) {
        parent = child.children
        route.path = ''
      }
      else if (segmentName === '404' && isSingleSegment) {
        route.path += '/:catchAll(.*)*'
      }
      else if (segmentName === 'index' && !route.path) {
        route.path += '/'
      }
      else if (segmentName !== 'index') {
        route.path += getRoutePath(tokens)
      }
    }

    parent.push(route)
  })

  return routes
}

