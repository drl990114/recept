import { ELEMENT_TEXT, FunctionComponent, HostComponent, HostText } from './constants'

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

export const setProps = (dom: HTMLElement, oldProps: any, newProps: any): void => {
  for (const key in oldProps) {
    if (key !== 'children') {
      if (Object.hasOwnProperty.call(newProps, key)) {
        setProp(dom, key, newProps[key])// 新老都有，则更新
      } else {
        dom.removeAttribute(key)// 老props里有此属性，新 props没有，则删除
      }
    }
  }
  for (const key in newProps) {
    if (key !== 'children') {
      if (!Object.hasOwnProperty.call(oldProps, key)) { // 老的没有，新的有，就添加此属性
        setProp(dom, key, newProps[key])
      }
    }
  }
}
const setProp = (dom: any, key: string, value: any): void => {
  if (/^on/.test(key)) { // onClick
    dom[key.toLowerCase()] = value// 没有用合成事件
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
