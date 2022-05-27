import { SReactFiber } from './types'

export const mountFiber = (parentDOM: Node, fiber: SReactFiber, nextDOM: Node): void => {
  const newDOM = createDOM(fiber)
  if (nextDOM != null) {
    parentDOM.insertBefore(newDOM, nextDOM)
  } else {
    parentDOM.appendChild(newDOM)
  }
}

export const fiberToDOM = (fiber: SReactFiber): Node | null => {
  const { type } = fiber
  if (typeof type === 'function') {
    return mountFunctionComponent(fiber)
  } else {
    return createDOM(fiber)
  }
}

export const mountFunctionComponent = (fiber: SReactFiber): Node | null => {
  const { type: functionComponent, props } = fiber
  const renderVdom = typeof functionComponent === 'function' && functionComponent(props)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!renderVdom) return null
  return fiberToDOM(renderVdom)
}

const createDOM = (fiber: SReactFiber): Node => {
  const dom =
  fiber.type === '#text'
    ? document.createTextNode('')
    : document.createElement(fiber.type as string)
  console.log('dom', fiber)
  return dom
}
