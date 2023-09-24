export interface VNode {
  type: string | object
  props?: object
  children?: (string | VNode)[] | string | VNode[]
}

export interface CompInstance {
  vnode: VNode
  type: string | object
  render?: () => VNode
}
