/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SReactFiber } from './types'
import { beginWork } from './beginWork'
import { HostRoot } from './constants'
import { commitRoot } from './commit'

let workInProgress: any = null
let workInProgressRoot: any = null
let nextUnitOfWork: any = null
export const deletions: any[] = []
let currentRoot: any = null

export const render = (vdom: any, node: Node): void => {
  const rootFiber: any = {
    tag: HostRoot,
    stateNode: node,
    props: { children: [vdom] }
  }
  workInProgress = rootFiber
  scheduleRoot(rootFiber)
}

export const scheduleRoot = (rootFiber: SReactFiber): void => { // {tag:TAG_ROOT,stateNode:container,props: { children: [element] }}
  if (currentRoot?.alternate != null) {
    // Performed at least one render
    workInProgressRoot = currentRoot.alternate
    workInProgressRoot.alternate = currentRoot
    if (rootFiber != null) workInProgressRoot.props = rootFiber.props
  } else if (currentRoot != null) {
    if (rootFiber != null) {
      rootFiber.alternate = currentRoot
      workInProgressRoot = rootFiber
    } else {
      workInProgressRoot = {
        ...currentRoot,
        alternate: currentRoot
      }
    }
  } else {
    // first render
    workInProgressRoot = rootFiber
  }
  nextUnitOfWork = workInProgressRoot
}

export const scheduleUpdateOnFiber = (oldFiber: SReactFiber): any => {
  const newFiber = {
    ...oldFiber,
    alternate: oldFiber
  }
  nextUnitOfWork = newFiber
  workInProgress = newFiber
}

const performUnitOfWork = (unitOfWorkFiber: any): any => {
  beginWork(unitOfWorkFiber.alternate, unitOfWorkFiber)
  if (unitOfWorkFiber.child != null) {
    return unitOfWorkFiber.child
  }

  while (unitOfWorkFiber != null) {
    if (unitOfWorkFiber.sibling != null) {
      return unitOfWorkFiber.sibling
    }
    unitOfWorkFiber = unitOfWorkFiber.return
  }
}

// Loop processing fiber units of work
const workLoop = (deadline: IdleDeadline): void => {
  let shouldYield = false
  while (nextUnitOfWork != null && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (nextUnitOfWork == null && workInProgressRoot != null) {
    console.log('fiber构造结束', workInProgressRoot)
    commitRoot(workInProgressRoot, deletions)
    console.log('渲染阶段结束', workInProgressRoot)
    currentRoot = workInProgressRoot// 把当前渲染成功的根fiber 赋给currentRoot
    workInProgressRoot = null
    workInProgress = null
  }
  if (nextUnitOfWork == null && workInProgress != null) {
    console.log('workinprogress', workInProgress)
    commitRoot(workInProgress, deletions)
    workInProgress = null
  }
  requestIdleCallback(workLoop, { timeout: 500 })
}
requestIdleCallback(workLoop, { timeout: 500 })
