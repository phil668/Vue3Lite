import { hasOwn } from '@mini-vue-phil/shared'
import type { CompInstance } from './types'

const publicPropsMap = {
  $el: (i: CompInstance) => i.vnode.el,
  $slots: (i: CompInstance) => i.slots,
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
