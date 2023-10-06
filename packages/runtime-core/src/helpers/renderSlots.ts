import type { Slots } from '../types'
import { createVnode } from '../vnode'

function renderSlots(slots: Slots, slotName: string) {
  if (!slots)
    return {}
  if (slots[slotName])
    return createVnode('div', {}, slots[slotName])

  else
    return {}
}

export { renderSlots }
