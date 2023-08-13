import { describe, expect, it } from 'vitest'
import { isReadonly, readonly } from '../src/reactive'

describe('effect', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(wrapped.bar)).toBe(true)
  })
})
