import { isObject } from '@mini-vue-phil/shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

function createGetter<T extends object>(isReadonly = false) {
  return (target: T, key: string) => {
    const value = Reflect.get(target, key)

    if (isObject(value))
      return isReadonly ? readonly(value as object) : reactive(value as object)

    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

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

export { createMutableHandlers, createGetter }
