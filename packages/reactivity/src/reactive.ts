import { createGetter, createMutableHandlers } from './baseHandler'

function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, createMutableHandlers<T>())
}

function readonly<T extends object>(raw: T): T {
  return new Proxy(raw, {
    get: createGetter(true),
    set(_target, _key: string, _value) {
      return true
    },
  })
}

export { reactive, readonly }
