export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
}

export interface AstTree {
  type: NodeTypes.ROOT
  children: Array<Node>
}

export interface Node {
  type: NodeTypes
  content?: string | Node
  children?: Array<Node>
  tag?: string
}
