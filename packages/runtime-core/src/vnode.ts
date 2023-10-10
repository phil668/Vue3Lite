import { ShapeFlags, isObject } from '@mini-vue-phil/shared'
import type { VNode } from './types'

export const Fragment = Symbol('fragment')
export const Text = Symbol('text')

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

  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children))
      vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN
  }
  return vnode
}

function createTextVNode(text: string) {
  return createVnode(Text, {}, text)
}

function getShapeFlag(type: VNode['type']) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

export { createVnode, createTextVNode }
