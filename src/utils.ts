import { FunctionComponent, HostComponent } from './workTags'

export const giveTag = (fiber: any): any => {
  if (fiber.tag != null) return fiber
  if (typeof fiber.type === 'function') {
    fiber.tag = FunctionComponent
  } else {
    fiber.tag = HostComponent
  }
}
