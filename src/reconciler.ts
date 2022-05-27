import { HostComponent } from './workTags'

export function reconcileChildren (current: any, returnFiber: any, nextChildren: any): void {
  console.log('应该构建fiber树', current, returnFiber, nextChildren)
  const childFiber = {
    tag: HostComponent,
    type: nextChildren.type
  }
  returnFiber.child = childFiber
}
