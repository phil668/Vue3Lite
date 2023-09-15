import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../src'
import { computed } from '../src/computed'
import { ref } from '../src/ref'

describe('computed', () => {
  it('happy path', () => {
    const original = reactive({
      foo: 1,
    })
    const getter = vi.fn().mockImplementation(() => {
      return original.foo
    })
    const cValue = computed(getter)
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // lazy
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    original.foo = 2
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    const list = ref([1, 2, 3])
    const renderList = computed(() => {
      return list.value.map((v: number) => {
        return {
          name: v,
        }
      })
    })
    expect(renderList.value).toMatchInlineSnapshot(`
      [
        {
          "name": 1,
        },
        {
          "name": 2,
        },
        {
          "name": 3,
        },
      ]
    `)
  })
})
