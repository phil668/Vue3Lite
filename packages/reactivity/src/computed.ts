import { ReactiveEffect } from './effect'

type ComputedGetter = (...args: any[]) => any

class ComputedRefImpl {
  private _getter: ComputedGetter
  private _value: any
  private _dirty = true
  private _effect: ReactiveEffect<any>
  constructor(getter: ComputedGetter) {
    this._getter = getter
    this._effect = new ReactiveEffect(this._getter, {
      scheduler: () => {
        if (!this._dirty)
          this._dirty = true
      },
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }

    return this._value
  }
}

function computed(getter: ComputedGetter) {
  return new ComputedRefImpl(getter)
}

export { computed }
