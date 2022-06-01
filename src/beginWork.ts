import { createDOM } from './dom'
import { renderWithHooks } from './hooks'
import { reconcileChildren } from './reconciler'
import { SReactFiber } from './types'
import { FunctionComponent, HostComponent, HostRoot, HostText } from './constants'

export const beginWork = (current: SReactFiber, workInProgress: SReactFiber): any => {
  console.log('beginwork', current, workInProgress)
  if (current != null) {
    switch (workInProgress.tag) {
      case HostRoot:
        return updateHostRoot(current, workInProgress)
      case FunctionComponent:
        return updateFunctionComponent(
          current,
          workInProgress,
          workInProgress.type
        )
      case HostComponent:
        return updateHost(current, workInProgress)
      case HostText:
        return updateHostText(current, workInProgress)
      default:
        break
    }
  } else {
    switch (workInProgress.tag) {
      case HostRoot:
        return mountHostRoot(current, workInProgress)
      case FunctionComponent:
        return mountFunctionComponent(
          current,
          workInProgress,
          workInProgress.type as Function
        )
      case HostComponent:
        return mountHost(current, workInProgress)
      case HostText:
        return mountHostText(current, workInProgress)
      default:
        break
    }
  }
}

const updateFunctionComponent = (current: any, workInProgress: any, Component: any): any => {
  const newChildren = renderWithHooks(
    current,
    workInProgress,
    Component
  )
  reconcileChildren(current, workInProgress, newChildren)
  return workInProgress.child
}

const updateHostRoot = (current: SReactFiber|null, workInProgress: SReactFiber): void => {
  const newChildren = workInProgress.props.children
  reconcileChildren(current, workInProgress, newChildren)
}

const updateHost = (current: SReactFiber | null, workInProgress: SReactFiber): void => {
  if (workInProgress.stateNode == null) {
    workInProgress.stateNode = createDOM(workInProgress)
  }
  const newChildren = workInProgress.props.children
  reconcileChildren(current, workInProgress, newChildren)
}

const updateHostText = (currentFiber: SReactFiber | null, workInProgress: SReactFiber): void => {
  if (workInProgress.stateNode == null) {
    workInProgress.stateNode = createDOM(workInProgress)
  }
}
// mount
// -------------------------------------------------------------------------------

const mountFunctionComponent = (current: SReactFiber | null, workInProgress: SReactFiber, Component: Function): SReactFiber | undefined => {
  const children = renderWithHooks(
    current,
    workInProgress,
    Component
  )
  workInProgress.tag = FunctionComponent
  reconcileChildren(current, workInProgress, children)
  return workInProgress.child
}
const mountHostRoot = (current: SReactFiber|null, workInProgress: SReactFiber): void => {
  const newChildren = workInProgress.props.children
  reconcileChildren(current, workInProgress, newChildren)
}

const mountHost = (current: SReactFiber | null, workInProgress: SReactFiber): void => {
  if (workInProgress.stateNode == null) {
    workInProgress.stateNode = createDOM(workInProgress)
  }
  const newChildren = workInProgress.props.children
  reconcileChildren(current, workInProgress, newChildren)
}

const mountHostText = (currentFiber: SReactFiber | null, workInProgress: SReactFiber): void => {
  if (workInProgress.stateNode == null) {
    workInProgress.stateNode = createDOM(workInProgress)
  }
}
