import { hasChanged, isObject } from '@mini-vue-phil/shared'
import { type ReactiveEffect, isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

/**
 * ref的实现思路
 * vue响应式的实现思路 => 读取时进行拦截 并track => 设置时进行拦截 并trigger
 * 如果是原始值类型的话，比如字符串，数字，布尔值，我们就可以利用class的get和set进行拦截
 */

function ref(value: any) {
  return new RefImpl(value)
}

class RefImpl {
  private _value: any
  private _deps: Set<ReactiveEffect> = new Set()
  private _raw: any
  public isRef = true

  constructor(value: any) {
    this._raw = value
    this._value = convert(value)
  }

  get value() {
    if (isTracking())
      trackEffects(this._deps)

    return this._value
  }

  set value(newValue: any) {
    if (!hasChanged(this._raw, newValue))
      return
    this._raw = newValue
    this._value = convert(newValue)
    triggerEffects(this._deps)
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value
}

function isRef(ref: any) {
  return ref instanceof RefImpl
}

function unRef(ref: any) {
  return isRef(ref) ? ref.value : ref
}

function proxyRefs(objectWithRef: any) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value))
        return target[key].value = value

      else
        return Reflect.set(target, key, value)
    },
  })
}

export { ref, isRef, unRef, proxyRefs }
