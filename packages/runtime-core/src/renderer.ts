import { createComponentInstance, setupComponent } from './component'

function render(vnode: any, container: any) {
  // patch
}

function patch(vnode: any, container: any) {
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
}

export { render, patch }
