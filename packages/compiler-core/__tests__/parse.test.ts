import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { NodeTypes } from '../src/ast'

describe('parse', () => {
  it('simple interpolation', () => {
    const ast = baseParse('{{ message}}')
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: 'message',
      },
    })
  })

  it('element', () => {
    const ast = baseParse('<div></div>')
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
    })
  })
})
