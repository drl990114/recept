import { beginWork } from './beginWork'
import { giveTag } from './utils'

let workInProgress: any = null

export const schedule = (): void => {

}
const performUnitOfWork = (unitOfWork: any): any => {
  // shoule async
  const current = unitOfWork.alternate
  return beginWork(current, unitOfWork)
}
const workLoop = (): void => {
  while (workInProgress != null) {
    workInProgress = performUnitOfWork(workInProgress)
  }
}
export const scheduleUpdateOnFiber = (oldFiber: any): void => {
  const newFiber = {
    ...oldFiber,
    alternate: oldFiber
  }// 新的CounterFiber开始执行更新
  workInProgress = newFiber
  workLoop()
}
export const render = (fiber: any, node: Node): void => {
  // eslint-disable-next-line no-debugger
  debugger
  console.log('render', fiber)
  giveTag(fiber)
  workInProgress = fiber
  workLoop()
}
