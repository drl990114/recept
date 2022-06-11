import { ELEMENT_TEXT } from './constants'
import { SReactElement, SReactFiber } from './types'
import { setProps } from './utils'

export const createDOM = (fiberOrVom: SReactFiber | SReactElement): Node => {
  const dom =
  fiberOrVom.type === ELEMENT_TEXT
    ? document.createTextNode(fiberOrVom.props.text)
    : document.createElement(fiberOrVom.type as string)
  updateDOM(dom, {}, fiberOrVom.props)

  return dom
}

export const updateDOM = (stateNode: HTMLElement | Text, oldProps: any, newProps: any): void => {
  if (stateNode instanceof Text) return
  setProps(stateNode, oldProps, newProps)
}
