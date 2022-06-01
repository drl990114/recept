/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { SReactElement, SReactFiber } from './types'
import { DELETION, ELEMENT_TEXT, FunctionComponent, HostComponent, HostText, MOVE, PLACEMENT, UPDATE } from './constants'
import { deletions } from './scheduler'

// reconcile的场景
// 第一种场景：key相同，类型相同，数量相同。那么复用老节点，只更新属性
// <div key="title" id="title">title</div>
// 更改后：
// <div key="title" id="title2">title2</div>

// shouldTrackSideEffects 是否要跟踪副作用
function childReconciler (shouldTrackSideEffects: boolean) {
//   // 如果不需要跟踪副作用，直接返回
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
        } else {
          newFiber = {
            tag: oldFiber.tag,
            type: oldFiber.type,
            props: newChild.props,
            stateNode: oldFiber.stateNode,
            return: wip,
            effectTag: UPDATE,
            alternate: oldFiber
          }
          newFiber.return = wip
        }
        return newFiber
      }
      const created = createFiberFromElement(newChild)
      created.effectTag = PLACEMENT
      created.return = wip
      return created
    }
    return null
  }

  function placeChild (newFiber: SReactFiber, lastPlaceIndex: number, newIdx: number) {
    newFiber.index = newIdx

    const current = newFiber.alternate
    if (current) {
      const oldIndex = current.index!
      // 如果旧fiber对应的真实DOM挂载的索引比lastPlaceIndex小
      if (oldIndex && oldIndex < lastPlaceIndex) {
        // 旧fiber对应的真实dom就需要移动了
        newFiber.effectTag = MOVE
        return lastPlaceIndex
      } else {
        // 否则，不需要移动，并且把旧fiber的原来的挂载索引返回成为新的lastPlaceIndex
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
      // 如果key不一样，直接结束返回null
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
  function reconcileChildrenArray (current: SReactFiber | null, wip: SReactFiber, newChild: any[]) {
    let resultingFirstChild = null
    let previousNewFiber = null
    let oldChildFiber: any = current?.child
    let nextOldFiber = null
    let newIdx = 0
    let lastPlaceIndex = 0

    for (; oldChildFiber && newIdx < newChild.length; newIdx++) {
      nextOldFiber = oldChildFiber.sibling
      // 试图复用旧的fiber节点
      const newFiber = updateSlot(wip, oldChildFiber, newChild[newIdx])
      // 如果key不一样，则跳出
      if (!newFiber) break
      // 旧的fiber存在，但是新的fiber并没有复用旧的fiber
      if (oldChildFiber && !newFiber.alternate) {
        deleteChild(oldChildFiber)
      }
      lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx) // 其核心是给当前的newFiber添加一个副作用flags：新增
      if (!previousNewFiber) {
        resultingFirstChild = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
      oldChildFiber = nextOldFiber
    }
    if (lastPlaceIndex === newChild.length) {
      deleteRemainingChildren(wip, oldChildFiber)
      console.log('resultingFirstChild1', resultingFirstChild)
      return resultingFirstChild
    }

    if (!oldChildFiber) {
      // 如果没有旧的fiber节点，则遍历newChild，为每个虚拟dom创建一个新的fiber
      for (; newIdx < newChild.length; newIdx++) {
        const newFiber = createChild(wip, newChild[newIdx])
        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIdx)
        newFiber.effectTag = PLACEMENT
        if (!previousNewFiber) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
      console.log('resultingFirstChild2', resultingFirstChild)
      wip.child = resultingFirstChild!
      return resultingFirstChild
    }

    // 将剩下的旧的fiber放入map中
    const existingChildren = mapRemainingChildren(wip, oldChildFiber)
    for (; newIdx < newChild.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        wip,
        newIdx,
        newChild[newIdx]
      )
      if (newFiber) {
        // 如果alternate存在，则表示是复用的节点
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
  // function reconcileChildren (current: SReactFiber | null, workInProgress: SReactFiber, newChildren: any[]): void {
  //   console.log('应该构建此fiber的子fiber树', current, workInProgress, newChildren)
  //   newChildren = isArr(newChildren) ? newChildren : [newChildren]
  //   let newChildIndex = 0
  //   let oldFiber = current?.child ?? workInProgress.alternate?.child
  //   let prevSibling: SReactFiber | null = null

  //   while (newChildIndex < newChildren.length || (oldFiber != null)) {
  //     const newChild = newChildren[newChildIndex]
  //     let newFiber: SReactFiber | null = null
  //     const sameType = (oldFiber != null) && newChild && oldFiber.type === newChild.type
  //     giveTag(newChild)
  //     if (sameType) {
  //       if (oldFiber?.alternate != null) {
  //         newFiber = oldFiber.alternate
  //         newFiber.props = newChild.props
  //         newFiber.effectTag = UPDATE
  //         newFiber.alternate = oldFiber
  //       } else {
  //         newFiber = {
  //           tag: oldFiber!.tag,
  //           type: oldFiber!.type,
  //           props: newChild.props,
  //           stateNode: oldFiber!.stateNode,
  //           return: workInProgress,
  //           effectTag: UPDATE,
  //           alternate: oldFiber
  //         }
  //       }
  //     } else {
  //       console.log('newChild,', newChild)
  //       if (newChild) {
  //         newFiber = {
  //           tag: newChild.tag, // worktag
  //           type: newChild.type,
  //           props: newChild.props,
  //           effectTag: PLACEMENT,
  //           stateNode: null,
  //           return: workInProgress
  //         }
  //       }
  //       if (oldFiber) {
  //         oldFiber.effectTag = DELETION
  //         deletions.push(oldFiber)
  //       }
  //     }

  //     if (oldFiber != null) {
  //       oldFiber = oldFiber.sibling
  //     }

  //     if (newFiber != null) {
  //       if (newChildIndex === 0) {
  //         workInProgress.child = newFiber
  //       } else {
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         prevSibling!.sibling = newFiber
  //       }
  //       prevSibling = newFiber
  //     }
  //     newChildIndex++
  //   }
  //   console.log('构建此fiber的子fiber树完成', workInProgress)
  // }

  // currentFirstChild 旧的fiber节点 newChild新的虚拟DOM
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
    props
  }
}
