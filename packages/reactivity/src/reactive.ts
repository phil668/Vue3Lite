import { createMutableHandlers, createReadonlyHandlers, createShallowReadonlyHandlers } from './baseHandler'

enum ReactiveFlags {
  IS_REACTIVE = '__v_is_reactive',
  IS_READONLY = '__v_is_readonly',
}

function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, createMutableHandlers<T>())
}

function readonly<T extends object>(raw: T): T {
  return new Proxy(raw, createReadonlyHandlers<T>())
}

function shallowReadonly<T extends object>(raw: T): T {
  return new Proxy(raw, createShallowReadonlyHandlers())
}

function isReactive(target: any) {
  return !!target[ReactiveFlags.IS_REACTIVE]
}

function isReadonly(target: any) {
  return !!target[ReactiveFlags.IS_READONLY]
}

function isProxy(target: any) {
  return isReactive(target) || isReadonly(target)
}

export { reactive, readonly, ReactiveFlags, isReactive, isReadonly, shallowReadonly, isProxy }
