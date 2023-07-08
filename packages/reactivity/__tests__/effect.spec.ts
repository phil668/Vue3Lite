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

  it('scheduler', () => {
    // 1. 当effect内传入scheduler时,默认还是执行fn函数
    // 2. 当依赖更新,trigger后,执行scheduler函数
    // 3. 当执行runner的时候还是执行fn函数
    let dummy
    let run: (...args: any[]) => void = () => {}
    let runner: (...args: any[]) => void
    const scheduler = vi.fn().mockImplementation(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })
})
