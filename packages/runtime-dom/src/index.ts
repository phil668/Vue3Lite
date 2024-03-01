import { createRenderer } from '@mini-vue-phil/runtime-core'
import type { Renderer } from '@mini-vue-phil/shared'
import { isOn } from '@mini-vue-phil/shared'

const createElement: Renderer['createElement'] = (type: string) => {
  return document.createElement(type)
}

const patchProp: Renderer['patchProp'] = (el: HTMLElement, key: string, prevValue: unknown, nextValue: unknown) => {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, nextValue as any)
  }
  else {
    if (typeof nextValue === 'undefined' || nextValue === null)
      el.removeAttribute(key)

    else
      el.setAttribute(key, nextValue as string)
  }
}

const insert: Renderer['insert'] = (el: any, parent: any) => {
  (parent as HTMLElement).append(el)
}

const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
})

function createApp(...args: any[]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return renderer.createApp(...args)
}

export * from '@mini-vue-phil/runtime-core'

export { createApp }
