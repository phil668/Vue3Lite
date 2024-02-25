import { ShapeFlags, isObject, isOn } from '@mini-vue-phil/shared'
import { createComponentInstance, setupComponent } from './component'
import type { CompInstance, VNode } from './types'
import { Fragment, Text } from './vnode'

function render(vnode: VNode, container: HTMLElement) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: HTMLElement) {
  const { type, shapeFlag } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break

    case Text:
      processText(vnode, container)
      break

    default:
      if (shapeFlag & ShapeFlags.ELEMENT)
        processElement(vnode, container)

      else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
        processComponent(vnode, container)

      // 处理组件
      break
  }
}

function processElement(vnode: VNode, container: HTMLElement) {
  mountElement(vnode, container)
}

function processFragment(vnode: VNode, container: HTMLElement) {
  mountChildren(vnode, container)
}

function processText(vnode: VNode, container: HTMLElement) {
  const { children } = vnode
  const textNode = vnode.el = document.createTextNode(children as string) as any
  container.append(textNode)
}

function mountElement(vnode: VNode, container: HTMLElement) {
  if (typeof vnode.type !== 'string')
    return

  const { type, children, props, shapeFlag } = vnode
  const el = (vnode.el = document.createElement(type))

  // props
  if (props && isObject(props)) {
    Object.entries(props).forEach(([key, value]) => {
      // handle events
      if (isOn(key)) {
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, value)
      }
      else
        el.setAttribute(key, value)
    })
  }

  // children
  if (children && shapeFlag & ShapeFlags.TEXT_CHILDREN)
    el.innerText = children as string

  else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
    mountChildren(vnode, el)

  container.appendChild(el)
}

function mountChildren(vnode: VNode, container: HTMLElement) {
  Array.isArray(vnode.children) && vnode.children.forEach((v) => {
    patch(v as VNode, container)
  })
}

function processComponent(vnode: VNode, container: HTMLElement) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: VNode, container: HTMLElement) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: CompInstance, vnode: VNode, container: HTMLElement) {
  if (instance.render) {
    const subTree = instance.render.call(instance.proxy)
    patch(subTree, container)
    vnode.el = subTree.el
  }
}

export { render, patch }
