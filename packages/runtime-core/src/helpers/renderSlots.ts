import type { Slots, VNode } from '../types'
import { Fragment, createVnode } from '../vnode'

function renderSlots(slots: Slots, slotName: string, props: VNode['props']) {
  if (!slots)
    return {}
  const slot = slots[slotName]
  console.log('slot', slot, props, slot(props))
  if (typeof slot === 'function')
    return createVnode(Fragment, {}, slot(props))

  else
    return {}
}

export { renderSlots }
