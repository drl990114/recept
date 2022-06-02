import { DELETION, ELEMENT_TEXT, HostComponent, HostRoot, PLACEMENT, HostText, UPDATE, MOVE } from './constants'
import { updateDOM } from './dom'
import { SReactFiber } from './types'

export const commitRoot = (workInProgressRoot: SReactFiber, deletions: any[]): void => {
  deletions.forEach(commitWork)
  commitWork(workInProgressRoot.child)
  deletions.length = 0
}
export const commitWork = (currentFiber: SReactFiber | null | undefined): void => {
  if (currentFiber == null) return
  console.log('commit', {
    tag: currentFiber.effectTag,
    props: currentFiber.props,
    type: currentFiber.type,
    stateNode: currentFiber.stateNode
  })

  let returnFiber = currentFiber.return
  while (returnFiber?.tag !== HostText &&
      returnFiber?.tag !== HostRoot &&
      returnFiber?.tag !== HostComponent) {
    returnFiber = returnFiber?.return
    console.log('commit')
  }
  const domReturn = returnFiber.stateNode as Node
  if (currentFiber.effectTag === PLACEMENT) { // 新增加节点
    const nextFiber = currentFiber
    ;(nextFiber.stateNode != null) && domReturn.appendChild(nextFiber.stateNode)
  } else if (currentFiber.effectTag === DELETION) {
    return commitDeletion(currentFiber, domReturn)
  } else if (currentFiber.effectTag === UPDATE) {
    if (currentFiber.type === ELEMENT_TEXT) {
      if (currentFiber.alternate?.props.text !== currentFiber.props.text) {
        (currentFiber.stateNode != null) && (currentFiber.stateNode.textContent = currentFiber.props.text)
      }
    } else {
      updateDOM(currentFiber.stateNode as any,
        currentFiber.alternate?.props, currentFiber.props)
    }
  } else if (currentFiber.effectTag === MOVE) {
    // TODO 移动节点
    console.log('需要移动节点')
  }
  currentFiber.effectTag = null
  commitWork(currentFiber.child)
  commitWork(currentFiber.sibling)
}
const commitDeletion = (currentFiber: SReactFiber, domReturn: HTMLElement | Node): void => {
  if (currentFiber.tag === HostComponent || currentFiber.tag === HostText) {
    (currentFiber.stateNode != null) && domReturn.removeChild(currentFiber.stateNode)
  } else {
    if (currentFiber?.child != null) {
      commitDeletion(currentFiber.child, domReturn)
    }
  }
}
