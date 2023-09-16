import { isObject } from '@mini-vue-phil/shared'

function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  }
  return vnode
}

function setupComponent(instance: any) {
  // TODO
  // initProps()
  // initSlots()
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const component = instance.vnode.type
  const { setup } = component
  if (setup) {
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  if (isObject(setupResult))
    instance.setupState = setupResult

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  if (Component.render)
    instance.render = Component.render
}

export { createComponentInstance, setupComponent }