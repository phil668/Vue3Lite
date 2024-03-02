import type { Renderer } from '@mini-vue-phil/shared'
import { ShapeFlags, isObject } from '@mini-vue-phil/shared'
import { effect } from '@mini-vue-phil/reactivity'
import { createComponentInstance, setupComponent } from './component'
import type { ComponentInternalInstance, VNode } from './types'
import { Fragment, Text } from './vnode'
import { createAppApi } from './createApp'

export function createRenderer(renderer: Renderer) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = renderer

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
      patchElement(n1, n2, container, parentComponent)
  }

  function patchElement(n1: VNode, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null) {
    console.log('n1', n1)
    console.log('n2', n2)

    const oldProps = n1?.props || {}
    const newProps = n2.props || {}

    const el = (n2.el = n1.el)

    el && patchProps(el, oldProps, newProps)

    const c1 = n1.children
    const c2 = n2.children

    // 处理children
    // Array => Text 把之前el下的节点移除 然后替换成text
    const prevShapeFlag = n1.shapeFlag
    const nextShapeFlag = n2.shapeFlag

    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 把之前的节点删除
        unmountChildren(c1 as VNode[])
        // 挂载新的文本节点
      }

      if (c1 !== c2)
        hostSetElementText(container, c2 as string)
    }
    else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(n2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children: VNode[]) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  /**
 * @desc 更新prop
 * 3种情况
 * 1. {foo:1} => {foo:2} 需要更新对应的属性
 * 2. 新的属性被设置成了undefined或者null，需要删除该属性
 * 3. 新的prop没有该属性，也需要删除该属性
 * @param el
 * @param oldProps
 * @param newProps
 */
  function patchProps(el: HTMLElement, oldProps: any, newProps: any) {
    //
    for (const key in newProps) {
      const oldValue = oldProps[key]
      const newValue = newProps[key]

      if (oldValue !== newValue)
        hostPatchProp(el, key, oldValue, newValue)
    }

    for (const key in oldProps) {
      if (!(key in newProps))
        hostPatchProp(el, key, oldProps[key], null)
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
        const subTree = instance.render.call(instance.proxy)
        const prevTree = instance.subTree!
        patch(prevTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppApi(render),
  }
}
