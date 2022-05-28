import { SReactElement, SReactFiber } from './types'

export const mountFiber = (parentDOM: Node, fiber: SReactFiber, nextDOM: Node): void => {
  const newDOM = createDOM(fiber)
  if (nextDOM != null) {
    parentDOM.insertBefore(newDOM, nextDOM)
  } else {
    parentDOM.appendChild(newDOM)
  }
}

export const createDOM = (fiberOrVom: SReactFiber | SReactElement): Node => {
  const dom =
  fiberOrVom.type === '#text'
    ? document.createTextNode('')
    : document.createElement(fiberOrVom.type as string)
  return dom
}
