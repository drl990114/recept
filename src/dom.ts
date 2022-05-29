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
    ? document.createTextNode(fiberOrVom.props.text)
    : document.createElement(fiberOrVom.type as string)
  updateDOM(dom, {}, fiberOrVom.props)

  return dom
}

const updateDOM = (stateNode: HTMLElement | Text, oldProps: any, newProps: any): void => {
  if (stateNode instanceof Text) return
  if (oldProps == null) {
    Object.keys(newProps).forEach(keyName => {
      stateNode.setAttribute(keyName, newProps[keyName])
    })
  } else {
    // TODO update
  }
}
