type VNodeTypes = string | object | symbol

export type Slots = Record<string, (...args: any[]) => VNode[]>

export type Data = Record<string, unknown>

export interface SlotRaw {
  [slotName: string]: unknown
}

export interface VNode {
  type: VNodeTypes
  el: null | HTMLElement
  shapeFlag: number
  key: string | number
  component: ComponentInternalInstance | null
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
  next: VNode | null
  props?: object
  slots?: Slots
  emit?: (...args: any) => void | any
  render?: () => VNode
  proxy?: Object
  name?: string
  subTree?: VNode
  update?: (...args: any[]) => any
}
