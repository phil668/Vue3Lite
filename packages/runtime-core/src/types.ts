export interface VNode {
  type: string | object
  props?: object
  children?: string | VNode[]
}
