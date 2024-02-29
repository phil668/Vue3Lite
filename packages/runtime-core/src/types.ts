type VNodeTypes = string | object | symbol

export type Slots = Record<string, (...args: any[]) => VNode[]>

type Data = Record<string, unknown>

export interface SlotRaw {
  [slotName: string]: unknown
}

export interface VNode {
  type: VNodeTypes
  el: null | HTMLElement
  shapeFlag: number
  props?: object
  children?: (string | VNode)[] | string | VNode | Record<string, VNode> | SlotRaw
  render?: () => VNode
}

export interface ComponentInternalInstance {
  vnode: VNode
  type: VNodeTypes
  setupState: null | object
  provides: Data
  isMounted: boolean
  parent: ComponentInternalInstance | null
  props?: object
  slots?: Slots
  emit?: (...args: any) => void | any
  render?: () => VNode
  proxy?: Object
  name?: string
  subTree?: VNode
}
