export type Key = string | number
export interface SReactElement<P = any, T = string | Function> {
  type: T
  props: P
}

export interface Ref<T = any> {
  current: T
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
  effectTag?: symbol | null
  stateNode?: Node | null
  memoizedState?: any // hook head node
}
