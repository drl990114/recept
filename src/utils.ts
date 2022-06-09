import {
  ELEMENT_TEXT,
  FunctionComponent,
  HostComponent,
  HostText
} from './constants'

export const giveTag = (fiber: any): void => {
  if (fiber?.tag != null) return
  if (typeof fiber !== 'object') return
  if (typeof fiber.type === 'function') {
    fiber.tag = FunctionComponent
  } else if (fiber.type === ELEMENT_TEXT) {
    fiber.tag = HostText
  } else {
    fiber.tag = HostComponent
  }
}

export const isArr = Array.isArray
export const isFn = (v: any): boolean => typeof v === 'function'

export const setProps = (
  dom: HTMLElement,
  oldProps: any,
  newProps: any
): void => {
  for (const key in oldProps) {
    if (key !== 'children') {
      if (Object.hasOwnProperty.call(newProps, key)) {
        setProp(dom, key, newProps[key])
      } else {
        dom.removeAttribute(key)
      }
    }
  }
  for (const key in newProps) {
    if (key !== 'children') {
      if (!Object.hasOwnProperty.call(oldProps, key)) {
        setProp(dom, key, newProps[key])
      }
    }
  }
}
const setProp = (dom: any, key: string, value: any): void => {
  if (key.toLowerCase() === 'classname') {
    key = 'class'
  }
  if (/^on/.test(key)) {
    dom[key.toLowerCase()] = value
  } else if (key === 'style') {
    if (value != null) {
      for (const styleName in value) {
        dom.style[styleName] = value[styleName]
      }
    }
  } else {
    dom.setAttribute(key, value)
  }
}
