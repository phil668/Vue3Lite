import { isObject } from '@mini-vue-phil/shared'
import type { CompInstance, VNode } from './types'

function initSlots(instance: CompInstance, children: VNode['children']) {
  const slot: any = {}
  if (!isObject(children))
    return
  for (const key in (children as object)) {
    const value = (children as any)[key]
    slot[key] = Array.isArray(value) ? value : [value]
  }
  instance.slots = slot
}

export { initSlots }
