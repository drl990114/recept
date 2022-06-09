/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SReactFiber, ITask } from './types'
import { beginWork } from './beginWork'
import { HostRoot } from './constants'
import { commitRoot } from './commit'
import { isFn } from './utils'

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
  schedule(bridge)
}

export const scheduleRoot = (rootFiber: SReactFiber): void => {
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
  schedule(bridge)
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
  return null
}

// Loop processing fiber units of work
const bridge = (): void => {
  while (nextUnitOfWork != null && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (nextUnitOfWork != null) return schedule(bridge)

  if (nextUnitOfWork == null && workInProgressRoot != null) {
    commitRoot(workInProgressRoot, deletions)
    currentRoot = workInProgressRoot
    workInProgressRoot = null
    workInProgress = null
  }
  if (nextUnitOfWork == null && workInProgress != null) {
    commitRoot(workInProgress, deletions)
    workInProgress = null
  }
}

const queue: ITask[] = []
const threshold: number = 5
const transitions: any[] = []
let deadline: number = 0

const startTransition = (cb: any): void => {
  transitions.push(cb) && translate()
}

export const schedule = (callback: any): void => {
  queue.push({ callback } as any)
  startTransition(flush)
}

const task = (pending: boolean): Function => {
  const cb = (): void => transitions.splice(0, 1).forEach(c => c())
  if (!pending && typeof Promise !== 'undefined') {
    return () => queueMicrotask(cb)
  }
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }
  return () => setTimeout(cb)
}

let translate = task(false)

const flush = (): void => {
  deadline = getTime() + threshold
  let job = peek(queue)
  while (job && !shouldYield()) {
    const { callback } = job as any
    job.callback = null
    const next = isFn(callback) && callback()
    if (next) {
      job.callback = next
    } else {
      queue.shift()
    }
    job = peek(queue)
  }
  job && (translate = task(shouldYield())) && startTransition(flush)
}

const shouldYield = (): boolean => {
  return getTime() >= deadline
}

const getTime = (): number => performance.now()

const peek = (queue: ITask[]): ITask => queue[0]
