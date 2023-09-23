import type { VNode } from './types'

function createVnode(type: VNode['type'], props?: VNode['props'], children?: VNode['children']): VNode {
  return {
    type,
    props,
    children,
  }
}

export { createVnode }
