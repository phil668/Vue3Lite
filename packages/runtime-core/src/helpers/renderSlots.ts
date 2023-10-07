import type { Slots, VNode } from '../types'
import { FRAGMENT, createVnode } from '../vnode'

function renderSlots(slots: Slots, slotName: string, props: VNode['props']) {
  if (!slots)
    return {}
  const slot = slots[slotName]
  console.log('slot', slot, props)
  if (typeof slot === 'function')
    return createVnode(FRAGMENT, {}, slot(props))

  else
    return {}
}

export { renderSlots }
