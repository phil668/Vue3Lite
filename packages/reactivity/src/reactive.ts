import { createGetter, createMutableHandlers } from './baseHandler'

enum ReactiveFlags {
  IS_REACTIVE = '__v_is_reactive',
  IS_READONLY = '__v_is_readonly',
}

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

function isReactive(target: any) {
  return !!target[ReactiveFlags.IS_REACTIVE]
}

function isReadonly(target: any) {
  return !!target[ReactiveFlags.IS_READONLY]
}

export { reactive, readonly, ReactiveFlags, isReactive, isReadonly }
