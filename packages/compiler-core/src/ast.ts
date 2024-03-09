export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
}

export interface Node {
  type: NodeTypes
  content?: string | Node
  children?: Array<Node>
  tag?: string
}
