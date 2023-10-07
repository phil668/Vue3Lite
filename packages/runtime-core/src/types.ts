type VNodeTypes = string | object

export type Slots = Record<string, (...args: any[]) => VNode[]>

export interface VNode {
  type: VNodeTypes
  el: null | HTMLElement
  shapeFlag: number
  props?: object
  children?: (string | VNode)[] | string | VNode | Record<string, VNode>
  render?: () => VNode
}

export interface CompInstance {
  vnode: VNode
  type: VNodeTypes
  setupState: null | object
  props?: object
  slots?: Slots
  emit?: (...args: any) => void | any
  render?: () => VNode
  proxy?: Object
  name?: string
}
