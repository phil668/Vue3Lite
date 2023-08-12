import { describe, expect, it } from 'vitest'
import { reactive } from '../src/index'
import { isReactive, isReadonly, readonly } from '../src/reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReadonly(observed)).toBe(false)
    expect(isReadonly(readonly(observed))).toBe(true)
  })
})
