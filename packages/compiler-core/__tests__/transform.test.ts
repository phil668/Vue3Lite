import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import type { Node } from '../src/ast'
import { NodeTypes } from '../src/ast'

describe('transform', () => {
  it('simple text', () => {
    const ast = baseParse('hi,')
    const plugin = (node: Node) => {
      if (node.type === NodeTypes.TEXT)
        node.content = 'hi,mini-vue'
    }
    transform(ast, { nodeTransforms: [plugin] })
    expect(ast.children[0].content).toBe('hi,mini-vue')
  })
})
