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

function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, {
    get: createGetter<T>(),
    set: createSetter<T>(),
  })
}

function readonly<T extends object>(raw: T): T {
  return new Proxy(raw, {
    get: createGetter(true),
    set(target, key: string, value) {
      return true
    },
  })
}

export { reactive, readonly }
