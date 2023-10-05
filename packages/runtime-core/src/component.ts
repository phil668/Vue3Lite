import { isObject } from '@mini-vue-phil/shared'
import type { CompInstance, VNode } from './types'
import { publicInstanceHandler } from './publicComponentInstance'
import { initProps } from './componentProps'

function createComponentInstance(vnode: VNode): CompInstance {
  const component = {
    vnode,
    type: vnode.type,
    setupState: null,
  }
  return component
}

function setupComponent(instance: CompInstance) {
  // TODO
  initProps(instance, instance.vnode.props || {})
  // initSlots()
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const component = instance.vnode.type

  instance.proxy = new Proxy({ _: instance }, publicInstanceHandler)

  if (component?.setup) {
    const setupResult = component.setup(instance.props)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: CompInstance, setupResult: any) {
  if (isObject(setupResult))
    instance.setupState = setupResult

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: CompInstance) {
  const Component = instance.type as any
  if (Component.render)
    instance.render = Component.render
}

export { createComponentInstance, setupComponent }
