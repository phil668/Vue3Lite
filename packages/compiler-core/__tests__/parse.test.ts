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
      children: [],
    })
  })

  it('simple text', () => {
    const ast = baseParse('some text')
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.TEXT,
      content: 'some text',
    })
  })
})

describe('multile children', () => {
  it('nested children', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.TEXT,
          content: 'hi,',
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    })
  })

  it('nested children2', () => {
    const ast = baseParse('<div><p>hi,</p>{{message}}</div>')
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeTypes.TEXT,
              content: 'hi,',
            },
          ],
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    })
  })

  it('should throw error', () => {
    expect(() => {
      baseParse('<div><span></div>')
    }).toThrowError('缺少结束标签: span')
  })
})
