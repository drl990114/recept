import { mountFunctionComponent } from './dom'
import { renderWithHooks } from './hooks'
import { reconcileChildren } from './reconciler'
import { SReactFiber } from './types'
import { FunctionComponent } from './workTags'

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
      case FunctionComponent:
        return mountFunctionComponent(
          workInProgress
        )
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
  console.log('Component children', newChildren)
  reconcileChildren(current, workInProgress, newChildren)
  return workInProgress.child
}
