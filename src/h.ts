import { ELEMENT_TEXT } from './constants'
import { SReactElement } from './types'
import { isArr } from './utils'

export const h = (type: any, props: any = {}, ...children: any): SReactElement => {
  children = expand(children)
  console.log('createElement', type, props, children)
  return createElement(type, props, children)
}

const expand = (arr: any[], target: any[] = []): any[] => {
  arr.forEach(v => {
    isArr(v)
      ? expand(v, target)
      : target.push(typeof v === 'string' ? createText(v) : v)
  })
  return target
}
const createElement = (
  type: any,
  props: any,
  children: any[]
): SReactElement => ({
  type,
  props: {
    ...props,
    children: children.map(child => {
      return typeof child === 'object' ? child : createText(child)
    })
  }
})

export const createText = (text: string): SReactElement => ({ type: ELEMENT_TEXT, props: { text, children: [] } })
