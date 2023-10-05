// enum VNodeTypes {
//   // 元素节点
//   ELEMENT = 'element',

//   // 组件节点
//   COMPONENT = 'component',

//   // 文本节点
//   TEXT = 'text',

//   // 片段节点
//   FRAGMENT = 'fragment',

//   // Portal 节点
//   PORTAL = 'portal',

//   // 注释节点
//   COMMENT = 'comment',
// }
type VNodeTypes = string | object

export interface VNode {
  type: VNodeTypes
  el: null | HTMLElement
  shapeFlag: number
  props?: object
  children?: (string | VNode)[] | string | VNode[]
  render?: () => VNode
}

export interface CompInstance {
  vnode: VNode
  type: VNodeTypes
  setupState: null | object
  props?: object
  emit?: (...args: any) => void | any
  render?: () => VNode
  proxy?: Object
  name?: string
}
