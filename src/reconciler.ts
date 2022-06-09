import { SReactElement, SReactFiber, TReconcileChildFibers } from './types'
import { DELETION, ELEMENT_TEXT, FunctionComponent, HostComponent, HostText, PLACEMENT, UPDATE } from './constants'
import { deletions } from './scheduler'

function childReconciler (shouldTrackSideEffects: boolean): TReconcileChildFibers {
  function deleteChild (firstChild: SReactFiber | null | undefined, child: SReactFiber): void {
    if (!shouldTrackSideEffects) return
    child.effectTag = DELETION
    deletions.push(child)

    let prevChild = firstChild
    let nextChild = firstChild
    while (nextChild != null && prevChild != null) {
      if (nextChild.effectTag === DELETION) {
        prevChild.sibling = nextChild.sibling
      }
      prevChild = nextChild
      nextChild = nextChild.sibling
    }
  }
  function createChild (returnFiber: SReactFiber, newChild: any): SReactFiber {
    const created = createFiberFromElement(newChild)
    created.return = returnFiber
    return created
  }
  function updateElement (wip: SReactFiber, oldFiber: SReactFiber, newChild: any): SReactFiber | null {
    if (oldFiber != null) {
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

  function placeChild (newFiber: SReactFiber, lastPlaceIndex: number, newIdx: number): number {
    newFiber.index = newIdx

    const current = newFiber.alternate
    if (current != null) {
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
  function updateFromMap (existingChildren: Map<any, any>, returnFiber: SReactFiber, newIdx: number, newChild: any): SReactFiber | null {
    const matchedFiber = existingChildren.get(newChild.key ?? newIdx)
    return updateElement(returnFiber, matchedFiber, newChild)
  }
  function updateSlot (wip: SReactFiber, oldFiber: SReactFiber, newChild: SReactFiber): SReactFiber | null {
    const key = oldFiber != null ? oldFiber.key : null
    if (newChild.key === key) {
      return updateElement(wip, oldFiber, newChild)
    } else {
      return null
    }
  }
  function deleteRemainingChildren (wip: SReactFiber, childFiber: SReactFiber | null | undefined): void {
    if (childFiber == null) return undefined
    let childToDelete: any = childFiber
    while (childToDelete != null) {
      deleteChild(wip.child, childToDelete)
      childToDelete = childToDelete.sibling
    }
  }

  function findNextStateNode (wip: SReactFiber): void {
    let siblingNode: any = null
    let nextFiber = wip.sibling
    while (siblingNode === null && nextFiber != null) {
      if (nextFiber.stateNode != null && nextFiber.effectTag !== PLACEMENT) {
        siblingNode = nextFiber.stateNode
      }
      nextFiber = nextFiber.sibling
    }
    wip.siblingNode = siblingNode
  }

  function functionComponentNodeTag (wip: SReactFiber): void {
    let current: any = wip
    while (current != null) {
      if (current.tag === FunctionComponent) findNextStateNode(current)
      current = current.sibling
    }
  }
  function reconcileChildrenArray (current: SReactFiber | null, wip: SReactFiber, newChilds: any[]): SReactFiber | null {
    let resultingFirstChild: any = null
    let previousNewFiber = null
    let oldChildFiber: any = current?.child
    let nextOldFiber = null
    let newIdx = 0
    let lastPlaceIndex = 0

    for (; oldChildFiber != null && newIdx < newChilds.length; newIdx++) {
      nextOldFiber = oldChildFiber.sibling
      const newFiber = updateSlot(wip, oldChildFiber, newChilds[newIdx])
      if (newFiber == null) {
        if (oldChildFiber == null) {
          oldChildFiber = nextOldFiber
        }
        break
      }
      if (oldChildFiber != null && (newFiber.alternate == null)) {
        deleteChild(wip.child, oldChildFiber)
      }
      lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
      if (previousNewFiber == null) {
        resultingFirstChild = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
      oldChildFiber = nextOldFiber
    }

    if (newIdx === newChilds.length) {
      deleteRemainingChildren(wip, oldChildFiber)
      functionComponentNodeTag(resultingFirstChild)
      wip.child = resultingFirstChild!
      return resultingFirstChild
    }

    if (oldChildFiber == null) {
      for (; newIdx < newChilds.length; newIdx++) {
        const newFiber = createChild(wip, newChilds[newIdx])
        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
        newFiber.effectTag = PLACEMENT
        if (previousNewFiber == null) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
      functionComponentNodeTag(resultingFirstChild)
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
      if (newFiber != null) {
        if (newFiber.alternate != null) {
          existingChildren.delete(newFiber.key ?? newIdx)
        }
        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
        if (previousNewFiber == null) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
    }
    existingChildren.forEach((child) => deleteChild(resultingFirstChild, child))
    functionComponentNodeTag(resultingFirstChild)
    wip.child = resultingFirstChild!
    return resultingFirstChild
  }
  function mapRemainingChildren (returnFiber: SReactFiber, currentFirstChild: SReactFiber): Map<number|string, SReactFiber> {
    const existingChildren = new Map()
    let existingChild: any = currentFirstChild
    while (existingChild != null) {
      const key = existingChild.key ?? existingChild.index
      existingChildren.set(key, existingChild)
      existingChild = existingChild.sibling
    }
    return existingChildren
  }
  function reconcileChildFibers (current: SReactFiber | null, wip: SReactFiber, newChild: any): void {
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
    ref: props?.ref,
    key: props?.key
  }
}
