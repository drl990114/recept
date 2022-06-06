import { DELETION, ELEMENT_TEXT, HostComponent, HostRoot, PLACEMENT, HostText, UPDATE } from './constants'
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
    stateNode: currentFiber.stateNode,
    key: currentFiber.key
  })

  let returnFiber = currentFiber.return
  while (returnFiber?.tag !== HostText &&
      returnFiber?.tag !== HostRoot &&
      returnFiber?.tag !== HostComponent) {
    returnFiber = returnFiber?.return
  }
  const domReturn = returnFiber.stateNode as Node
  if (currentFiber.effectTag === PLACEMENT) {
    const nextFiber = currentFiber
    if (nextFiber.stateNode != null) {
      let nextDOM = null
      let sibling = nextFiber.sibling
      while (sibling != null && nextDOM == null) {
        if (sibling.stateNode != null && sibling.effectTag !== PLACEMENT) {
          nextDOM = sibling.stateNode
          break
        }
        sibling = sibling.sibling
      }
      if (nextDOM != null) {
        domReturn.insertBefore(nextFiber.stateNode, nextDOM)
      } else {
        domReturn.appendChild(nextFiber.stateNode)
      }
    }
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
