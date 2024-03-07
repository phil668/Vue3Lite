import { hasOwn } from '@mini-vue-phil/shared'
import type { ComponentInternalInstance } from './types'

const publicPropsMap = {
  $el: (i: ComponentInternalInstance) => i.vnode.el,
  $slots: (i: ComponentInternalInstance) => i.slots,
  $props: (i: ComponentInternalInstance) => i.props,
}

const publicInstanceHandler = {
  get({ _: instance }: { _: any }, key: string) {
    const { setupState, props } = instance

    if (hasOwn(setupState, key))
      return setupState[key]

    else if (hasOwn(props, key))
      return props[key]

    const publicPropsGetter = (publicPropsMap as any)[key]
    if (publicPropsGetter)
      return publicPropsGetter(instance)
  },
}

export { publicInstanceHandler }
