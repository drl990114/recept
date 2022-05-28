export type Key = string | number
export interface SReactElement<P = any, T = string | Function> {
  type: T
  props: P
}

export interface SReactFiber<P = any> {
  key?: string
  type?: string | Function
  tag: number
  props?: any
  return?: SReactFiber<P>
  sibling?: SReactFiber<P>
  child?: SReactFiber<P>
  alternate?: SReactFiber<P> // old
  effectTag?: string
  stateNode?: Node | null
}
