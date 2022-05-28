import { SReactElement } from './types'

export const h = (type: any, props: any = {}, ...children: any): SReactElement => {
  console.log('createElement', children)
  return createElement(type, props, children)
}

const createElement = (
  type: any,
  props: any,
  children: any[]
): SReactElement => ({
  type,
  props: {
    ...props,
    children: children.map((child: any) => {
      return typeof child === 'object'
        ? child
        : {
            props: { text: child, children: [] }
          }
    })
  }
})
