import { ShapeFlags, isObject } from '@mini-vue-phil/shared'
import { effect } from '@mini-vue-phil/reactivity'
import { createComponentInstance, setupComponent } from './component'
import type { ComponentInternalInstance, VNode } from './types'
import { Fragment, Text } from './vnode'
import { createAppApi } from './createApp'

export interface Renderer {
  createElement: (type: string) => any
  patchProp: (el: any, key: string, value: unknown) => void
  insert: (el: any, parent: any) => void
}

export function createRenderer(renderer: Renderer) {
  const { createElement, patchProp, insert } = renderer

  function render(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null = null) {
    patch(vnode, container, parentComonent)
  }

  function patch(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null = null) {
    const { type, shapeFlag } = vnode
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComonent)
        break

      case Text:
        processText(vnode, container)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(vnode, container, parentComonent)

        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(vnode, container, parentComonent)

        // 处理组件
        break
    }
  }

  function processElement(vnode: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null) {
    mountElement(vnode, container, parentComponent)
  }

  function processFragment(vnode: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null) {
    mountChildren(vnode, container, parentComponent)
  }

  function processText(vnode: VNode, container: HTMLElement) {
    const { children } = vnode
    const textNode = vnode.el = document.createTextNode(children as string) as any
    insert(textNode, container)
  }

  function mountElement(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    if (typeof vnode.type !== 'string')
      return

    const { type, children, props, shapeFlag } = vnode
    const el = (vnode.el = createElement(type))

    // props
    if (props && isObject(props)) {
      Object.entries(props).forEach(([key, value]) => {
        patchProp(el, key, value)
      })
    }

    // children
    if (children && shapeFlag & ShapeFlags.TEXT_CHILDREN)
      el.innerText = children as string

    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(vnode, el, parentComonent)

    container.appendChild(el)
  }

  function mountChildren(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    Array.isArray(vnode.children) && vnode.children.forEach((v) => {
      patch(v as VNode, container, parentComonent)
    })
  }

  function processComponent(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    mountComponent(vnode, container, parentComonent)
  }

  function mountComponent(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    const instance = createComponentInstance(vnode, parentComonent)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
  }

  function setupRenderEffect(instance: ComponentInternalInstance, vnode: VNode, container: HTMLElement) {
    effect(() => {
      if (instance.render) {
        const subTree = instance.render.call(instance.proxy)
        patch(subTree, container, instance)
        vnode.el = subTree.el
      }
    })
  }

  return {
    createApp: createAppApi(render),
  }
}
