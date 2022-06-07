import { DEPENDEXEC, NOHOOKEFFECT, ONCE } from './constants'
import { scheduleUpdateOnFiber } from './scheduler'
import type { Ref, SReactFiber, hook, queue, IEffect } from './types'
import { isArr } from './utils'
let currentlyRenderingFiber: any = null
let workInProgressHook: any = null
let currentHook: any = null // old
let effectListIndex = 0
const ReactCurrentDispatcher: Ref = { current: null }

export const renderWithHooks = (current: SReactFiber | null, workInProgress: SReactFiber, Component: any): any => {
  currentlyRenderingFiber = workInProgress
  currentlyRenderingFiber.hook = null
  workInProgressHook = null
  currentHook = null
  effectListIndex = 0
  if (current != null) {
    ReactCurrentDispatcher.current = HookDispatcherOnUpdate
  } else {
    ReactCurrentDispatcher.current = HookDispatcherOnMount
  }

  const children = Component(currentlyRenderingFiber.props)
  currentlyRenderingFiber = null

  return children
}

export const useState = (initialState: any): any => {
  return ReactCurrentDispatcher.current.useState(initialState)
}

export const useReducer = (reducer: any, initialArg: any): any => {
  return ReactCurrentDispatcher.current.useReducer(reducer, initialArg)
}

export const useEffect = (cb: Function, deps?: any[]): any => {
  return ReactCurrentDispatcher.current.useEffect(cb, deps)
}

export const useMemo = (cb: Function, deps?: any[]): any => {
  return ReactCurrentDispatcher.current.useMemo(cb, deps)
}

export const useRef = (val: any): any => {
  return ReactCurrentDispatcher.current.useMemo(() => ({ current: val }), [])
}
const mountMemo = (cb: any, deps: any): void => {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = {
    res: cb(),
    deps
  }
  return hook.memoizedState.res
}

const updateMemo = (cb: any, deps: any): void => {
  const hook = updateWorkInProgressHook()

  if (isChanged(hook.memoizedState.deps, deps)) {
    hook.memoizedState.res = cb()
    hook.memoizedState.deps = deps
    return hook.memoizedState.res
  }

  return hook.memoizedState.res
}

const mountEffect = (cb: Function, deps?: any[]): void => {
  const nextDeps = deps === undefined ? null : deps
  if (isOnceEffect(nextDeps)) {
    pushEffect(ONCE, cb, undefined, nextDeps)
  } else {
    pushEffect(DEPENDEXEC, cb, undefined, nextDeps)
  }
  effectListIndex++
}

const updateEffect = (cb: Function, deps?: any[]): void => {
  const nextDeps = deps === undefined ? null : deps
  let destroy

  if (currentHook !== null) {
    const prevEffect = currentlyRenderingFiber.effect[effectListIndex]
    destroy = prevEffect.destroy
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps
      if (isChanged(nextDeps, prevDeps)) {
        updateCurrentEffect(DEPENDEXEC, cb, destroy, nextDeps)
      } else {
        updateCurrentEffect(NOHOOKEFFECT, cb, destroy, nextDeps)
      }
    }
  }
  effectListIndex++
}

const pushEffect = (tag: any, create: any, destroy: any, deps: any): IEffect => {
  const effect: IEffect = {
    tag,
    create,
    destroy,
    deps
  }
  if (currentlyRenderingFiber.effect == null) {
    currentlyRenderingFiber.effect = [effect]
  } else {
    currentlyRenderingFiber.effect[effectListIndex] = effect
  }

  return effect
}

const updateCurrentEffect = (tag: any, create: any, destroy: any, deps: any): void => {
  currentlyRenderingFiber.effect[effectListIndex] = {
    tag,
    create,
    destroy,
    deps
  }
}
const updateState = (initialState: any): any => {
  return updateReducer(basicStateReducer, initialState)
}

const mountState = (initialState: any): any => {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = initialState
  const queue = (hook.queue = {
    pending: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  })
  const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue)
  return [hook.memoizedState, dispatch]
}

const mountReducer = (reducer: any, initialArg: any): any => {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = initialArg
  const queue = hook.queue = { pending: null }
  const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue)
  return [hook.memoizedState, dispatch]
}

const updateReducer = (reducer: any, initialArg: any): any => {
  const hook = updateWorkInProgressHook()
  const queue = hook.queue
  const current = currentHook
  const pendingQueue = queue?.pending

  if (pendingQueue != null) {
    const first = pendingQueue.next
    let newState = current.memoizedState
    let update: hook |null|undefined = first
    do {
      const action = update?.action
      newState = reducer(newState, action)
      update = update?.next
    } while (update !== null && update !== first)
    ;(queue != null) && (queue.pending = null)
    hook.memoizedState = newState
    ;(queue != null) && (queue.lastRenderedState = newState)
  }

  const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue)
  return [hook.memoizedState, dispatch]
}

const dispatchAction = (currentlyRenderingFiber: SReactFiber, queue: queue, action: any): void => {
  const update: any = { action, next: null }
  const pending = queue.pending
  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  queue.pending = update
  const lastRenderedReducer = queue.lastRenderedReducer
  const lastRenderedState = queue.lastRenderedState

  const eagerState = lastRenderedReducer(lastRenderedState, action)
  update.eagerReducer = lastRenderedReducer
  update.eagerState = eagerState
  if (Object.is(eagerState, lastRenderedState)) {
    return
  }
  scheduleUpdateOnFiber(currentlyRenderingFiber)
}

const mountWorkInProgressHook = (): hook => {
  const hook = {
    memoizedState: null,
    queue: null,
    next: null
  }

  if (workInProgressHook === null) {
    currentlyRenderingFiber.hook = workInProgressHook = hook
  } else {
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}

const updateWorkInProgressHook = (): hook => {
  let nextCurrentHook
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate
    nextCurrentHook = current.hook
  } else {
    nextCurrentHook = currentHook.next ?? currentHook
  }
  currentHook = nextCurrentHook

  const newHook = {
    memoizedState: currentHook.memoizedState,
    queue: currentHook.queue,
    next: null
  }

  if (workInProgressHook === null) {
    currentlyRenderingFiber.hook = workInProgressHook = newHook
  } else {
    workInProgressHook.next = newHook
    workInProgressHook = newHook
  }

  return workInProgressHook
}

const basicStateReducer = (state: any, action: any): any => typeof action === 'function' ? action(state) : action

const HookDispatcherOnMount = {
  useState: mountState,
  useReducer: mountReducer,
  useEffect: mountEffect,
  useMemo: mountMemo
}
const HookDispatcherOnUpdate = {
  useState: updateState,
  useReducer: updateReducer,
  useEffect: updateEffect,
  useMemo: updateMemo
}

const isChanged = (a: any[], b: any[]): boolean => {
  if (a == null || b == null) return true
  return a.length !== b.length || b.some((arg: any, index: number) => !Object.is(arg, a[index]))
}

const isOnceEffect = (deps: any): boolean => {
  return isArr(deps) && deps.length === 0
}
