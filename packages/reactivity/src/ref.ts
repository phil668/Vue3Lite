import { hasChanged, isObject } from '@mini-vue-phil/shared'
import { type ReactiveEffect, isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

/**
 * ref的实现思路
 * vue响应式的实现思路 => 读取时进行拦截 并track => 设置时进行拦截 并trigger
 * reactive 基于proxy实现，可以实现对对象的读取和设置进行拦截
 * 如果是原始值类型的话，比如字符串，数字，布尔值，我们就可以利用class的get和set进行拦截
 */

class RefImpl {
  private _value: any
  private _deps: Set<ReactiveEffect> = new Set()
  constructor(value: any) {
    this._value = isObject(value) ? reactive(value) : value
  }

  get value() {
    if (isTracking())
      trackEffects(this._deps)

    return this._value
  }

  set value(newValue: any) {
    if (!hasChanged(this._value, newValue))
      return

    this._value = isObject(newValue) ? reactive(newValue) : newValue
    triggerEffects(this._deps)
  }
}

function ref(value: any) {
  return new RefImpl(value)
}

export { ref }
