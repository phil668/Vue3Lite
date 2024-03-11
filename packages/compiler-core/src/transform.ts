import type { AstTree, Node } from './ast'

type NodeTransform = ((node: Node) => any)

type NodeTransforms = NodeTransform[]

interface TransformContext {
  root: AstTree
  nodeTransforms: NodeTransforms
}

interface TransformOptions {
  nodeTransforms: NodeTransforms
}

export function transform(root: AstTree, options?: TransformOptions) {
  const ctx = createTransformContext(root, options)
  traverse(root, ctx)
  craeteRootCodegen(root)
  return root
}

function craeteRootCodegen(root: AstTree) {
  root.codegenNode = root.children[0]
}

function createTransformContext(root: AstTree, options?: TransformOptions): TransformContext {
  return {
    root,
    nodeTransforms: options?.nodeTransforms || [],
  }
}

function traverse(node: Node, ctx: TransformContext) {
  const { nodeTransforms } = ctx
  for (const nodeTransform of nodeTransforms)
    nodeTransform(node)

  traverseChildren(node, ctx)
}

function traverseChildren(node: Node, ctx: TransformContext) {
  node.children?.forEach((v) => {
    traverse(v, ctx)
  })
}
