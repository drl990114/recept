import { ELEMENT_TEXT, FunctionComponent, HostComponent, HostText } from './constants'

export const giveTag = (fiber: any): void => {
  if (fiber?.tag != null) return fiber
  if (typeof fiber.type === 'function') {
    fiber.tag = FunctionComponent
  } else if (fiber.type === ELEMENT_TEXT) {
    fiber.tag = HostText
  } else {
    fiber.tag = HostComponent
  }
}

export const isArr = Array.isArray
