import { createRenderer } from '@mini-vue-phil/runtime-core'
import { isOn } from '@mini-vue-phil/shared'

function createElement(type: string) {
  return document.createElement(type)
}

function patchProp(el: any, key: string, value: unknown) {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, value as any)
  }
  else
    el.setAttribute(key, value as string)
}

function insert(el: any, parent: any) {
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
