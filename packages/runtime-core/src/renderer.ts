import { isObject } from '@mini-vue-phil/shared'
import { createComponentInstance, setupComponent } from './component'
import type { VNode } from './types'

function render(vnode: VNode, container: HTMLElement) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: HTMLElement) {
  if (vnode.type === 'string') {
    processElement(vnode, container)
  }
  else {
    // 处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode: VNode, container: HTMLElement) {
  if (typeof vnode.type !== 'string')
    return

  const { type, children, props } = vnode
  const el = document.createElement(type)

  if (props && isObject(props)) {
    Object.entries(props).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      el.setAttribute(key, value)
    })
  }

  if (Array.isArray(children))
    mountChildren(vnode, el)
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

function setupRenderEffect(instance: any, container: HTMLElement) {
  const subTree = instance.render()
  patch(subTree, container)
}

export { render, patch }
