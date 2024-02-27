import { isObject } from '@mini-vue-phil/shared'
import { shallowReadonly } from '@mini-vue-phil/reactivity'
import type { ComponentInternalInstance, VNode } from './types'
import { publicInstanceHandler } from './publicComponentInstance'
import { initProps } from './componentProps'
import { emit } from './componentEmit'
import { initSlots } from './componentSlots'

function createComponentInstance(vnode: VNode, parent: ComponentInternalInstance | null): ComponentInternalInstance {
  const compInstance: ComponentInternalInstance = {
    vnode,
    type: vnode.type,
    setupState: null,
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : Object.create(parent),
    parent,
  }
  compInstance.emit = emit.bind(null, compInstance)
  return compInstance
}

function setupComponent(instance: ComponentInternalInstance) {
  initProps(instance, instance.vnode.props || {})
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const component = instance.vnode.type

  instance.proxy = new Proxy({ _: instance }, publicInstanceHandler)

  //  调用setup函数
  if (component?.setup) {
    setCurrentInstance(instance)
    const setupResult = component.setup(shallowReadonly(instance.props), { emit: instance.emit })
    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: ComponentInternalInstance, setupResult: any) {
  if (isObject(setupResult))
    instance.setupState = setupResult

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: ComponentInternalInstance) {
  const Component = instance.type as any
  if (Component.render)
    instance.render = Component.render
}

let currentInstance: ComponentInternalInstance | null = null

function getCurrentInstance(): ComponentInternalInstance | null {
  return currentInstance
}

function setCurrentInstance(instance: ComponentInternalInstance | null) {
  currentInstance = instance
}

export { createComponentInstance, setupComponent, getCurrentInstance }
