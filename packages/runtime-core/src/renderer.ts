import type { Renderer } from '@mini-vue-phil/shared'
import { ShapeFlags, isObject } from '@mini-vue-phil/shared'
import { effect } from '@mini-vue-phil/reactivity'
import { createComponentInstance, setupComponent } from './component'
import type { ComponentInternalInstance, VNode } from './types'
import { Fragment, Text } from './vnode'
import { createAppApi } from './createApp'

export function createRenderer(renderer: Renderer) {
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = renderer

  function render(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null = null) {
    patch(null, vnode, container, parentComonent)
  }

  function patch(n1: VNode | null, n2: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null = null) {
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComonent)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parentComonent)

        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parentComonent)

        // 处理组件
        break
    }
  }

  function processElement(n1: VNode | null, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null) {
    if (!n1)
      mountElement(n2, container, parentComponent)

    else
      patchElement(n1, n2, container)
  }

  function patchElement(n1: VNode, n2: VNode, container: HTMLElement) {
    console.log('n1', n1)
    console.log('n2', n2)

    const oldProps = n1?.props || {}
    const newProps = n2.props || {}

    const el = (n2.el = n1.el)

    el && patchProps(el, oldProps, newProps)
  }

  function patchProps(el: HTMLElement, oldProps: any, newProps: any) {
    console.log('newProps', newProps)
    //
    for (const key in newProps) {
      const oldValue = oldProps[key]
      const newValue = newProps[key]

      console.log('oldValue', oldValue, newValue)

      if (oldValue !== newValue)
        hostPatchProp(el, key, oldValue, newValue)
    }
  }

  function processFragment(n1: VNode | null, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null) {
    mountChildren(n2, container, parentComponent)
  }

  function processText(n1: VNode | null, n2: VNode, container: HTMLElement) {
    const { children } = n2
    const textNode = n2.el = document.createTextNode(children as string) as any
    hostInsert(textNode, container)
  }

  function mountElement(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    if (typeof vnode.type !== 'string')
      return

    const { type, children, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(type))

    // props
    if (props && isObject(props)) {
      Object.entries(props).forEach(([key, value]) => {
        hostPatchProp(el, key, null, value)
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
      patch(null, v as VNode, container, parentComonent)
    })
  }

  function processComponent(n1: VNode | null, n2: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    mountComponent(n2, container, parentComonent)
  }

  function mountComponent(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null) {
    const instance = createComponentInstance(vnode, parentComonent)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container)
  }

  function setupRenderEffect(instance: ComponentInternalInstance, vnode: VNode, container: HTMLElement) {
    effect(() => {
      if (!instance.render)
        return

      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(instance.proxy))
        patch(null, subTree, container, instance)
        vnode.el = subTree.el
        instance.isMounted = true
      }
      else {
        console.log('update')
        const subTree = instance.render.call(instance.proxy)
        const prevTree = instance.subTree!
        console.log('subTree', { prevTree, subTree })
        patch(prevTree, subTree, container, instance)
        // vnode.el = subTree.el
        // instance.isMounted = true
      }
    })
  }

  return {
    createApp: createAppApi(render),
  }
}
