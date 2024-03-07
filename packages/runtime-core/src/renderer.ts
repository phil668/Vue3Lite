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
    patch(null, vnode, container, parentComonent, null)
  }

  function patch(n1: VNode | null, n2: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null = null, anchor: HTMLElement | null) {
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComonent, anchor)
        break

      case Text:
        processText(n1, n2, container, anchor)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parentComonent, anchor)

        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parentComonent, anchor)

        // 处理组件
        break
    }
  }

  function processElement(n1: VNode | null, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
    if (!n1)
      mountElement(n2, container, parentComponent, anchor)

    else
      patchElement(n1, n2, container, parentComponent, anchor)
  }

  function patchElement(n1: VNode, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
    const oldProps = n1?.props || {}
    const newProps = n2.props || {}

    const el = (n2.el = n1.el)

    el && patchChildren(n1, n2, el, parentComponent, anchor)
    el && patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1: VNode, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
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
        mountChildren(n2, container, parentComponent, anchor)
      }
      else {
        // Array to Array
        patchKeyedChildren(c1 as VNode[], c2 as VNode[], container, parentComponent, anchor)
      }
    }
  }

  // 双端对比diff算法
  function patchKeyedChildren(c1: VNode[], c2: VNode[], conatiner: HTMLElement, parentComponent: ComponentInternalInstance | null, parentAnchor: HTMLElement | null) {
    let i = 0
    const l2 = c2.length

    let e1 = c1.length - 1
    let e2 = l2 - 1

    // 处理左边
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNode(n1, n2))
        patch(n1, n2, conatiner, parentComponent, parentAnchor)

      else
        break

      i++
    }

    // 处理右边
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNode(n1, n2))
        patch(n1, n2, conatiner, parentComponent, parentAnchor)

      else
        break

      e1--
      e2--
    }

    if (i > e1) {
      // 新的比老的多
      if (i <= e2) {
        const nextPos = i + 1
        const anchor = i + 1 < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], conatiner, parentComponent, anchor)
          i++
        }
      }
    }
    else if (i > e2) {
      // 说明老的比新的多
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    }
    else {
      const s1 = i
      const s2 = i
      const keyToNewIndexMap = new Map()
      const toBePatched = e2 - s2 + 1
      let moved = false
      let maxNewIndexSoFar = 0

      let patched = 0

      const newIndexToOldIndexMap = new Array(toBePatched)
      for (let i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0

      for (let i = s2; i <= e2; i++)
        keyToNewIndexMap.set(c2[i].key, i)

      for (let index = s1; index <= e1; index++) {
        const prevChild = c1[index]

        if (patched >= toBePatched) {
          hostRemove(prevChild)
          continue
        }

        let newIndex

        if (prevChild.key !== null || typeof prevChild.key !== 'undefined')
          newIndex = keyToNewIndexMap.get(prevChild.key)
        else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNode(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        // 如果newIndex为空的话，说明当前老节点的key在新节点中找不到，直接删除
        if (newIndex === null && typeof newIndex === 'undefined')
          hostRemove(prevChild)

        else {
          if (newIndex >= maxNewIndexSoFar)
            maxNewIndexSoFar = newIndex

          else
            moved = true

          newIndexToOldIndexMap[newIndex - s2] = index + 1
          patch(prevChild, c2[newIndex], conatiner, parentComponent, null)
          patched++
        }
      }

      // move
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
        if (newIndexToOldIndexMap[i] === 0) {
          // 说明之前没有需要mount
          patch(null, nextChild, conatiner, parentComponent, anchor)
        }
        else {
          if (moved) {
            if (j < 0 || increasingNewIndexSequence[j] !== i)
              hostInsert(nextChild.el, conatiner, anchor)

            else
              j--
          }
        }
      }
    }
  }

  function isSameVNode(n1: VNode, n2: VNode) {
    return n1.type === n2.type && n1.key === n2.key
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

  function processFragment(n1: VNode | null, n2: VNode, container: HTMLElement, parentComponent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
    mountChildren(n2, container, parentComponent, anchor)
  }

  function processText(n1: VNode | null, n2: VNode, container: HTMLElement, anchor: HTMLElement | null) {
    const { children } = n2
    const textNode = n2.el = document.createTextNode(children as string) as any
    hostInsert(textNode, container, anchor)
  }

  function mountElement(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
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
      mountChildren(vnode, el, parentComonent, anchor)

    // container.appendChild(el)
    hostInsert(el, container, anchor)
  }

  function mountChildren(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
    Array.isArray(vnode.children) && vnode.children.forEach((v) => {
      patch(null, v as VNode, container, parentComonent, anchor)
    })
  }

  function processComponent(n1: VNode | null, n2: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
    mountComponent(n2, container, parentComonent, anchor)
  }

  function mountComponent(vnode: VNode, container: HTMLElement, parentComonent: ComponentInternalInstance | null, anchor: HTMLElement | null) {
    const instance = createComponentInstance(vnode, parentComonent)
    setupComponent(instance)
    setupRenderEffect(instance, vnode, container, anchor)
  }

  function setupRenderEffect(instance: ComponentInternalInstance, vnode: VNode, container: HTMLElement, anchor: HTMLElement | null) {
    effect(() => {
      if (!instance.render)
        return

      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(instance.proxy))
        patch(null, subTree, container, instance, anchor)
        vnode.el = subTree.el
        instance.isMounted = true
      }
      else {
        const subTree = instance.render.call(instance.proxy)
        const prevTree = instance.subTree!
        instance.subTree = subTree
        patch(prevTree, subTree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppApi(render),
  }
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI)
          u = c + 1
        else
          v = c
      }
      if (arrI < arr[result[u]]) {
        if (u > 0)
          p[i] = result[u - 1]

        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
