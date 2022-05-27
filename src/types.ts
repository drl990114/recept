export type Key = string | number
export interface SReactElement<P = any, T = string | Function> {
  type: T
  props: P
  key: Key
  ref?: any
}

export interface SReactFiber<P = any> {
  key?: string
  type: string | Function
  tag: number
  props: any
  parentNode: HTMLElement
  childNodes: any
  node: HTMLElement
  kids?: any
  parent?: SReactFiber<P>
  sibling?: SReactFiber<P>
  child?: SReactFiber<P>
}
