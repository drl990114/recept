/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { giveTag } from './utils'
import { SReactFiber } from './types'
import { DELETION, PLACEMENT, UPDATE } from './constants'
import { deletions } from './scheduler'

export function reconcileChildren (current: SReactFiber | null, workInProgress: SReactFiber, newChildren: any[]): void {
  console.log('应该构建此fiber的子fiber树', current, workInProgress, newChildren)

  let newChildIndex = 0
  let oldFiber = workInProgress.alternate?.child
  let prevSibling: SReactFiber | null = null
  if (oldFiber) oldFiber.firstEffect = oldFiber.lastEffect = oldFiber.nextEffect = null

  while (newChildIndex < newChildren.length || (oldFiber != null)) {
    const newChild = newChildren[newChildIndex]
    let newFiber: SReactFiber | null = null
    const sameType = (oldFiber != null) && newChild && oldFiber.type === newChild.type
    giveTag(newChild)
    if (sameType) {
      if (oldFiber?.alternate != null) {
        newFiber = oldFiber.alternate
        newFiber.props = newChild.props
        newFiber.effectTag = UPDATE
        newFiber.alternate = oldFiber
        newFiber.nextEffect = null
      } else {
        newFiber = {
          tag: oldFiber!.tag,
          type: oldFiber!.type,
          props: newChild.props,
          stateNode: oldFiber!.stateNode,
          return: workInProgress,
          effectTag: UPDATE,
          alternate: oldFiber,
          nextEffect: null
        }
      }
    } else {
      console.log('newChild,', newChild)
      if (newChild) {
        newFiber = {
          tag: newChild.tag, // worktag
          type: newChild.type,
          props: newChild.props,
          effectTag: PLACEMENT,
          stateNode: null,
          return: workInProgress,
          nextEffect: null,
          firstEffect: null,
          lastEffect: null
        }
      }
      if (oldFiber) {
        oldFiber.effectTag = DELETION
        deletions.push(oldFiber)
      }
    }

    if (oldFiber != null) {
      oldFiber = oldFiber.sibling
    }

    if (newFiber != null) {
      if (newChildIndex === 0) {
        workInProgress.child = newFiber
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prevSibling!.sibling = newFiber
      }
      prevSibling = newFiber
    }
    newChildIndex++
  }
  console.log('构建此fiber的子fiber树完成', workInProgress)
}
