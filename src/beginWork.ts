import { createDOM } from './dom'
import { renderWithHooks } from './hooks'
import { reconcileChildren } from './reconciler'
import { SReactFiber } from './types'
import { isArr } from './utils'
import { FunctionComponent, HostComponent, HostRoot, HostText } from './constants'

export const beginWork = (current: SReactFiber, workInProgress: SReactFiber): any => {
  if (current != null) {
    switch (workInProgress.tag) {
      case FunctionComponent:
        return updateFunctionComponent(
          current,
          workInProgress,
          workInProgress.type
        )
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

const mountFunctionComponent = (current: SReactFiber | null, workInProgress: SReactFiber, Component: Function): SReactFiber | undefined => {
  const children = wrapChild(renderWithHooks(
    current,
    workInProgress,
    Component
  ))
  workInProgress.tag = FunctionComponent
  reconcileChildren(current, workInProgress, children)
  return workInProgress.child
}
const mountHostRoot = (current: SReactFiber|null, workInProgress: SReactFiber): void => {
  const newChildren = wrapChild(workInProgress.props.children)// [element=<div id="A1"]
  reconcileChildren(current, workInProgress, newChildren)
}

const mountHost = (current: SReactFiber | null, workInProgress: SReactFiber): void => {
  if (workInProgress.stateNode == null) {
    workInProgress.stateNode = createDOM(workInProgress)
  }
  const newChildren = wrapChild(workInProgress.props.children)
  reconcileChildren(current, workInProgress, newChildren)
}

const mountHostText = (currentFiber: SReactFiber | null, workInProgress: SReactFiber): void => {
  if (workInProgress.stateNode == null) {
    workInProgress.stateNode = createDOM(workInProgress)
  }
}
// tool
const wrapChild = (children: any): any[] => isArr(children) ? children : [children]
