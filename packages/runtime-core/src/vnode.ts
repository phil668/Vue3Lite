import { ShapeFlags } from '@mini-vue-phil/shared'
import type { VNode } from './types'

function createVnode(type: VNode['type'], props?: VNode['props'], children?: VNode['children']): VNode {
  const vnode: VNode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  }

  if (typeof children === 'string')
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN

  else if (Array.isArray(children))
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN

  return vnode
}

function getShapeFlag(type: VNode['type']) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

export { createVnode }
