import { ShapeFlags, isObject } from '@mini-vue-phil/shared'
import type { ComponentInternalInstance, Slots, VNode } from './types'

/**
 * slots 的功能其实就是组件的children 我们需要将vnode内的children取出来，挂载
 * 在组件实例上，并且通过proxy向外暴露$slots,以便于组件内访问，将外部传入的children渲
 * 染到特定的区域
 * @param instance
 * @param children
 * @returns
 */
function initSlots(instance: ComponentInternalInstance, children: VNode['children']) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN)
    instance.slots = normalizeObjectSlots(children)
}

function normalizeObjectSlots(children: VNode['children']): Slots {
  const slots: any = {}
  if (!isObject(children))
    return {}
  for (const key in (children as object)) {
    const value = (children as any)[key]
    // children要么是text_children 要么是array_children
    slots[key] = (props: any) => normalizeSlotValue(value(props))
  }
  return slots
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value]
}

export { initSlots }
