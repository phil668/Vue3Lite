import { describe, expect, it, vi } from 'vitest'
import { effect, reactive } from '../src/index'

describe('effect', () => {
  it('happy path', () => {
    const original = reactive({ foo: 1 })
    let number: any
    effect(() => {
      number = original.foo + 1
    })
    // effect should exectue once and bar.foo should be 1
    expect(number).toBe(2)
    original.foo++
    expect(number).toBe(3)
    original.foo++
    expect(number).toBe(4)
  })

  it('effect should return runner', () => {
    let foo = 0
    const fn = vi.fn().mockImplementation(() => {
      foo++
      return 'foo'
    })
    const runner = effect<String>(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    const bar = runner()
    expect(fn).toHaveBeenCalledTimes(2)
    expect(bar).toBe('foo')
  })
})
