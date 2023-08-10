import { track, trigger } from './effect'

function createGetter<T extends object>(isReadonly = false) {
  return (target: T, key: string) => {
    const value = Reflect.get(target, key)

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
