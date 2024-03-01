export interface Renderer {
  createElement: (type: string) => any
  patchProp: (el: any, key: string, prevValue: unknown, nextValue: unknown) => void
  insert: (el: any, parent: any) => void
}
