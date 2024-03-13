import type { Node } from '../ast'
import { NodeTypes } from '../ast'
import { CREATE_ELEMENT_VNODE } from '../runtimeHelpers'
import type { TransformContext } from '../transform'

export function transformElement(node: Node, context: TransformContext) {
  if (node.type === NodeTypes.ELEMENT)
    context.helper(CREATE_ELEMENT_VNODE)
}
