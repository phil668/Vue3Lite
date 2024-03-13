import type { Node } from '../ast'
import { NodeTypes } from '../ast'

export function transformExpression(node: Node) {
  if (node.type === NodeTypes.INTERPOLATION && node.content)
    node.content = processExpression(node.content as Node)
}

function processExpression(node: Node) {
  node.content = `_ctx.${node.content as string}`
  return node
}
