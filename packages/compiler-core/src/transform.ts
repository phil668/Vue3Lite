import { type AstTree, type Node, NodeTypes } from './ast'
import { TO_DISPLAY_STRING } from './runtimeHelpers'

type NodeTransform = ((node: Node) => any)

type NodeTransforms = NodeTransform[]

interface TransformContext {
  root: AstTree
  nodeTransforms: NodeTransforms
  helpers: Map<symbol, number>
  helper: (str: symbol) => void
}

interface TransformOptions {
  nodeTransforms: NodeTransforms
}

export function transform(root: AstTree, options?: TransformOptions) {
  const ctx = createTransformContext(root, options)
  traverse(root, ctx)
  craeteRootCodegen(root)

  root.helpers = [...ctx.helpers.keys()]
  return root
}

function craeteRootCodegen(root: AstTree) {
  root.codegenNode = root.children[0]
}

function createTransformContext(root: AstTree, options?: TransformOptions): TransformContext {
  return {
    root,
    nodeTransforms: options?.nodeTransforms || [],
    helpers: new Map(),
    helper(str) {
      this.helpers.set(str, 1)
    },
  }
}

function traverse(node: Node, ctx: TransformContext) {
  const { nodeTransforms } = ctx
  for (const nodeTransform of nodeTransforms)
    nodeTransform(node)

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      ctx.helper(TO_DISPLAY_STRING)
      break
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traverseChildren(node, ctx)
      break

    default:
      break
  }
}

function traverseChildren(node: Node, ctx: TransformContext) {
  node.children?.forEach((v) => {
    traverse(v, ctx)
  })
}
