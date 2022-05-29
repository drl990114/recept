import { ELEMENT_TEXT, FunctionComponent, HostComponent, TextNode } from './constants'

export const giveTag = (fiber: any): void => {
  if (fiber?.tag != null) return fiber
  if (typeof fiber.type === 'function') {
    fiber.tag = FunctionComponent
  } else if (fiber.type === ELEMENT_TEXT) {
    fiber.tag = TextNode
  } else {
    fiber.tag = HostComponent
  }
}

export const isArr = Array.isArray
