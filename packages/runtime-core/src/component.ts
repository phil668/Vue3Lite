import { isObject } from '@mini-vue-phil/shared'
import { shallowReadonly } from '@mini-vue-phil/reactivity'
import type { CompInstance, VNode } from './types'
import { publicInstanceHandler } from './publicComponentInstance'
import { initProps } from './componentProps'
import { emit } from './componentEmit'
import { initSlots } from './componentSlots'

function createComponentInstance(vnode: VNode): CompInstance {
  const compInstance: CompInstance = {
    vnode,
    type: vnode.type,
    setupState: null,
    emit: () => {},
    slots: {},
  }
  compInstance.emit = emit.bind(null, compInstance)

  return compInstance
}

function setupComponent(instance: CompInstance) {
  initProps(instance, instance.vnode.props || {})
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const component = instance.vnode.type

  instance.proxy = new Proxy({ _: instance }, publicInstanceHandler)

  if (component?.setup) {
    const setupResult = component.setup(shallowReadonly(instance.props), { emit: instance.emit })

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
