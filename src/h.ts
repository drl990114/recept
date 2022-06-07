import { ELEMENT_TEXT } from './constants'
import { SReactElement } from './types'
import { isArr } from './utils'

export const h = (type: any, props: any = {}, ...children: any): SReactElement => {
  children = expand(children)
  return createElement(type, props, children)
}

const createElement = (
  type: any,
  props: any,
  children: any[]
): SReactElement => ({
  type,
  key: props?.key,
  props: {
    ...props,
    children
  }
})

export const createText = (text: string | number): SReactElement => ({ type: ELEMENT_TEXT, props: { text, children: [] } })

// tools
const expand = (arr: any[], target: any[] = []): any[] => {
  arr.forEach(val => {
    isArr(val)
      ? expand(val, target)
      : notSpecial(val) && target.push(isStr(val) ? createText(val) : val)
  })
  return target
}

const notSpecial = (x: unknown): boolean => x != null && x !== true && x !== false
const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
