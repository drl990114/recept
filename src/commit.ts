import { DELETION, ELEMENT_TEXT, HostComponent, HostRoot, PLACEMENT, HostText, UPDATE, DEPENDEXEC, FunctionComponent, ONCE, NOHOOKEFFECT } from './constants'
import { updateDOM } from './dom'
import { schedule } from './scheduler'
import { SReactFiber } from './types'

export const commitRoot = (workInProgressRoot: SReactFiber, deletions: any[]): void => {
  deletions.forEach(commitWork)
  commitWork(workInProgressRoot)
  deletions.length = 0
}
export const commitWork = (currentFiber: SReactFiber | null | undefined): void => {
  if (currentFiber == null) return
  const fiberTag = currentFiber.effectTag
  schedule(() => commitHookEffectList(currentFiber, fiberTag))

  let returnFiber = currentFiber.return
  while (returnFiber != null && returnFiber?.tag !== HostText &&
      returnFiber?.tag !== HostRoot &&
      returnFiber?.tag !== HostComponent) {
    returnFiber = returnFiber?.return
  }
  const domReturn = returnFiber?.stateNode as Node
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
      if (currentFiber.tag !== FunctionComponent) {
        updateDOM(currentFiber.stateNode as any,
          currentFiber.alternate?.props, currentFiber.props)
      }
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
  commitHookEffectList(currentFiber, DELETION)
}

export const commitHookEffectList = (
  currentFiber: SReactFiber,
  fiberTag: any
): void => {
  const effectList = currentFiber.effect
  ;(effectList != null) && console.log('effectlist', effectList)
  effectList?.forEach((effect, index) => {
    if (fiberTag === DELETION || effect.tag === DEPENDEXEC) {
      // Unmount
      const destroy = effect.destroy
      effect.destroy = undefined
      if (destroy !== undefined) {
        destroy()
      }
    }
    if (effect.tag === ONCE) {
      // Mount
      const create = effect.create
      effect.destroy = create()
      effect.tag = NOHOOKEFFECT
    }
    if (effect.tag === DEPENDEXEC) {
      // Mount
      const create = effect.create
      effect.destroy = create()
    }
  })
}
