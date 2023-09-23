import type { VNode } from './types'
import { createVnode } from './vnode'

function h(type: VNode['type'], props?: VNode['props'], children?: VNode['children']) {
  createVnode(type, props, children)
}

export { h }
