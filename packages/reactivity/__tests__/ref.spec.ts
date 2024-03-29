import { describe, expect, it, vi } from 'vitest'
import { isRef, proxyRefs, ref, unRef } from '../src/ref'
import { effect } from '../src'

describe('ref', () => {
  it('happy path', () => {
    const obj = ref(1)
    expect(obj.value).toBe(1)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    const fn = vi.fn().mockImplementation(() => {
      dummy = a.value
    })
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(fn).toHaveBeenCalledTimes(2)
    expect(dummy).toBe(2)
    a.value = 2
    expect(fn).toHaveBeenCalledTimes(2)
    expect(dummy).toBe(2)
  })

  it('should make nested proerties reactive', () => {
    const a = ref({
      count: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('isRef', () => {
    const a = ref({
      count: 1,
    })
    expect(isRef(a)).toBe(true)
    expect(isRef(123)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
  })

  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'phil',
    }
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe('phil')

    proxyUser.age = 20
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(10)
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
  })
})
