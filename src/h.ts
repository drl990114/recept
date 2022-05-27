import { SReactElement } from './types'

export const h = (type: any, props: any = {}, ...kids: any): SReactElement => {
  const key = Boolean(props?.key) || null
  const ref = Boolean(props?.ref) || null
  return createElement(type, props, key, ref)
}

const createElement = (
  type: any,
  props: any,
  key: any,
  ref: any
): SReactElement => ({
  type,
  props,
  key,
  ref
})
