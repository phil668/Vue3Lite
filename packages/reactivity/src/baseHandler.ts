import { isObject } from '@mini-vue-phil/shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

function createGetter<T extends object>(isReadonly = false, shallow = false) {
  return (target: T, key: string) => {
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    const value = Reflect.get(target, key)

    if (shallow)
      return value

    if (isObject(value))
      return isReadonly ? readonly(value as object) : reactive(value as object)

    if (!isReadonly)
      track(target, key)

    return value
  }
}

function createSetter<T extends object>() {
  return (target: T, key: string, value: any) => {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

interface MutableHandlers<T extends object> {
  get: ReturnType<typeof createGetter<T>>
  set: ReturnType<typeof createSetter<T>>
}

function createMutableHandlers<T extends object>(): MutableHandlers<T> {
  const getter = createGetter<T>()
  const setter = createSetter<T>()

  return { get: getter, set: setter }
}

function createReadonlyHandlers<T extends object>() {
  const getter = createGetter<T>(true)
  return {
    get: getter,
    set(target: T, key: string) {
      console.warn(`set ${key} fail,beacuse this is readonly`)
      return true
    },
  }
}

function createShallowReadonlyHandlers<T extends object>() {
  return {
    get: createGetter<T>(true, true),
    set(target: T, key: string) {
      console.warn(`set ${key} fail,beacuse this is readonly`)
      return true
    },
  }
}

export { createMutableHandlers, createGetter, createReadonlyHandlers, createShallowReadonlyHandlers }
