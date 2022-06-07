/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { SReactElement, SReactFiber } from './types'
import { DELETION, ELEMENT_TEXT, FunctionComponent, HostComponent, HostText, PLACEMENT, UPDATE } from './constants'
import { deletions } from './scheduler'

function childReconciler (shouldTrackSideEffects: boolean) {
  function deleteChild (child: SReactFiber) {
    if (!shouldTrackSideEffects) return
    child.effectTag = DELETION
    deletions.push(child)
  }
  function createChild (returnFiber: SReactFiber, newChild: any) {
    const created = createFiberFromElement(newChild)
    created.return = returnFiber
    return created
  }
  function updateElement (wip: SReactFiber, oldFiber: SReactFiber, newChild: any): SReactFiber | null {
    if (oldFiber) {
      if (oldFiber.type === newChild.type) {
        let newFiber: SReactFiber|null = null
        newFiber = {
          ...oldFiber,
          props: newChild.props,
          key: newChild.key,
          return: wip,
          effectTag: UPDATE,
          alternate: oldFiber
        }
        return newFiber
      }
    }
    const created = createFiberFromElement(newChild)
    created.effectTag = PLACEMENT
    created.return = wip
    return created
  }

  function placeChild (newFiber: SReactFiber, lastPlaceIndex: number, newIdx: number) {
    newFiber.index = newIdx

    const current = newFiber.alternate
    if (current) {
      const oldIndex = current.index!
      if (oldIndex != null && oldIndex < lastPlaceIndex) {
        // The real DOM corresponding to the old fiber needs to be moved
        newFiber.effectTag = PLACEMENT
        return lastPlaceIndex
      } else {
        return oldIndex
      }
    } else {
      newFiber.effectTag = PLACEMENT
      return lastPlaceIndex
    }
  }
  function updateFromMap (existingChildren: Map<any, any>, returnFiber: SReactFiber, newIdx: number, newChild: any) {
    const matchedFiber = existingChildren.get(newChild.key || newIdx)
    return updateElement(returnFiber, matchedFiber, newChild)
  }
  function updateSlot (wip: SReactFiber, oldFiber: SReactFiber, newChild: SReactFiber) {
    const key = oldFiber ? oldFiber.key : null
    if (newChild.key === key) {
      return updateElement(wip, oldFiber, newChild)
    } else {
      return null
    }
  }
  function deleteRemainingChildren (wip: SReactFiber, oldFiber: SReactFiber | null | undefined) {
    if (oldFiber == null) return undefined
    let childToDelete: any = oldFiber
    while (childToDelete != null) {
      deleteChild(childToDelete)
      childToDelete = childToDelete.sibling
    }
  }
  function reconcileChildrenArray (current: SReactFiber | null, wip: SReactFiber, newChilds: any[]) {
    let resultingFirstChild = null
    let previousNewFiber = null
    let oldChildFiber: any = current?.child
    let nextOldFiber = null
    let newIdx = 0
    let lastPlaceIndex = 0
    for (; oldChildFiber && newIdx < newChilds.length; newIdx++) {
      nextOldFiber = oldChildFiber.sibling
      const newFiber = updateSlot(wip, oldChildFiber, newChilds[newIdx])
      if (!newFiber) {
        if (oldChildFiber == null) {
          oldChildFiber = nextOldFiber
        }
        break
      }
      if (oldChildFiber && !newFiber.alternate) {
        deleteChild(oldChildFiber)
      }
      lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
      if (!previousNewFiber) {
        resultingFirstChild = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
      oldChildFiber = nextOldFiber
    }

    if (lastPlaceIndex === newChilds.length) {
      deleteRemainingChildren(wip, oldChildFiber)
      wip.child = resultingFirstChild!
      return resultingFirstChild
    }

    if (!oldChildFiber) {
      for (; newIdx < newChilds.length; newIdx++) {
        const newFiber = createChild(wip, newChilds[newIdx])
        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
        newFiber.effectTag = PLACEMENT
        if (!previousNewFiber) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
      wip.child = resultingFirstChild!

      return resultingFirstChild
    }

    const existingChildren = mapRemainingChildren(wip, oldChildFiber)
    for (; newIdx < newChilds.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        wip,
        newIdx,
        newChilds[newIdx]
      )
      if (newFiber) {
        if (newFiber.alternate) {
          existingChildren.delete(newFiber.key ?? newIdx)
        }
        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
        if (!previousNewFiber) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
    }
    existingChildren.forEach((child) => deleteChild(child))
    wip.child = resultingFirstChild!
    return resultingFirstChild
  }
  function mapRemainingChildren (returnFiber: SReactFiber, currentFirstChild: SReactFiber) {
    const existingChildren = new Map()
    let existingChild: any = currentFirstChild
    while (existingChild) {
      const key = existingChild.key ?? existingChild.index
      existingChildren.set(key, existingChild)
      existingChild = existingChild.sibling
    }
    return existingChildren
  }
  function reconcileChildFibers (current: SReactFiber | null, wip: SReactFiber, newChild: any) {
    const isObject = typeof newChild === 'object' && newChild
    if (isObject) {
      // TODO 单个节点对比
    }
    if (Array.isArray(newChild)) {
      reconcileChildrenArray(current, wip, newChild)
    } else {
      reconcileChildrenArray(current, wip, [newChild])
    }
  }

  return reconcileChildFibers
}

export const reconcileChildFibers = childReconciler(true)

export const mountChildFibers = childReconciler(false)

const createFiberFromElement = (vdom: SReactElement): SReactFiber => {
  const { type, props } = vdom
  let tag
  if (type === ELEMENT_TEXT) {
    tag = HostText
  } else if (typeof type === 'string') {
    tag = HostComponent
  } else {
    tag = FunctionComponent
  }

  return {
    type,
    tag,
    props,
    key: props?.key
  }
}
