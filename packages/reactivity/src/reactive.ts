import { track, trigger } from './effect'

function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, {
    get(target, key: string) {
      const value = Reflect.get(target, key)
      // TODO 依赖追踪
      track(target, key)
      return value
    },
    set(target, key: string, value) {
      const res = Reflect.set(target, key, value)
      console.log('resizeBy', target)
      // TODO 触发依赖
      trigger(target, key)
      return res
    },
  })
}

export { reactive }
