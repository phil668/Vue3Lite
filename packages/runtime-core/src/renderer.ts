import { isObject } from '@mini-vue-phil/shared'
import { createComponentInstance, setupComponent } from './component'
import type { CompInstance, VNode } from './types'

function render(vnode: VNode, container: HTMLElement) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: HTMLElement) {
  if (typeof vnode?.type === 'string')
    processElement(vnode, container)

  else
    // 处理组件
    processComponent(vnode, container)
}

function processElement(vnode: VNode, container: HTMLElement) {
  if (typeof vnode.type !== 'string')
    return

  const { type, children, props } = vnode
  const el = document.createElement(type)

  if (props && isObject(props)) {
    Object.entries(props).forEach(([key, value]) => {
      el.setAttribute(key, value)
    })
  }

  if (children && !isObject(children))
    el.innerText = children as string

  else if (Array.isArray(children))
    mountChildren(vnode, el)

  container.appendChild(el)
}

function mountChildren(vnode: VNode, container: HTMLElement) {
  Array.isArray(vnode.children) && vnode.children.forEach((v) => {
    patch(v, container)
  })
}

function processComponent(vnode: VNode, container: HTMLElement) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: VNode, container: HTMLElement) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: CompInstance, container: HTMLElement) {
  if (instance.render) {
    const subTree = instance.render()
    patch(subTree, container)
  }
}

export { render, patch }
