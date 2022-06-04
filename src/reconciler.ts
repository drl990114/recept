/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { SReactElement, SReactFiber } from './types'
import { DELETION, ELEMENT_TEXT, FunctionComponent, HostComponent, HostText, MOVE, PLACEMENT, UPDATE } from './constants'
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
        if (oldFiber?.alternate != null) {
          newFiber = oldFiber.alternate
          newFiber.props = newChild.props
          newFiber.effectTag = UPDATE
          newFiber.alternate = oldFiber
          newFiber.key = newChild.key
        } else {
          newFiber = {
            tag: oldFiber.tag,
            type: oldFiber.type,
            props: newChild.props,
            key: newChild.key,
            stateNode: oldFiber.stateNode,
            return: wip,
            effectTag: UPDATE,
            alternate: oldFiber
          }
          newFiber.return = wip
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
      // 如果旧fiber对应的真实DOM挂载的索引比lastPlaceIndex小
      if (oldIndex != null && oldIndex < lastPlaceIndex) {
        // 旧fiber对应的真实dom就需要移动了
        newFiber.effectTag = MOVE
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
    console.log('deleteRemainingChildren', oldFiber)
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
    // 从左到右，找到最后可以复用的index
    for (; oldChildFiber && newIdx < newChilds.length; newIdx++) {
      nextOldFiber = oldChildFiber.sibling
      // 试图复用旧的fiber节点
      const newFiber = updateSlot(wip, oldChildFiber, newChilds[newIdx])
      // 如果key不一样，则跳出
      if (!newFiber) {
        if (oldChildFiber == null) {
          oldChildFiber = nextOldFiber
        }
        break
      }
      // 旧的fiber存在，但是新的fiber并没有复用旧的fiber
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
    console.log('lastPlaceIndex', lastPlaceIndex, newChilds)
    if (lastPlaceIndex === newChilds.length) {
      deleteRemainingChildren(wip, oldChildFiber)
      wip.child = resultingFirstChild!
      console.log('resultingFirstChild1', wip)

      return resultingFirstChild
    }

    if (!oldChildFiber) {
      // 如果没有旧的fiber节点，则遍历newChild，为每个虚拟dom创建一个新的fiber
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
      console.log('resultingFirstChild2', wip)

      return resultingFirstChild
    }

    // 将剩下的旧的fiber放入map中
    const existingChildren = mapRemainingChildren(wip, oldChildFiber)
    for (; newIdx < newChilds.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        wip,
        newIdx,
        newChilds[newIdx]
      )
      if (newFiber) {
        // 如果alternate存在，则是复用的节点
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
    console.log('existing', wip)
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
