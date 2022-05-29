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
  effectTag?: symbol
  stateNode?: Node | null
  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect: SReactFiber | null

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  firstEffect: SReactFiber | null
  lastEffect: SReactFiber | null
}
