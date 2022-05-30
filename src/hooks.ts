import { scheduleUpdateOnFiber } from './scheduler'
import { Ref, SReactFiber } from './types'
let currentlyRenderingFiber: any = null
let workInProgressHook: any = null
let currentHook: any = null // old
const ReactCurrentDispatcher: Ref = { current: null }

export const renderWithHooks = (current: any, workInProgress: SReactFiber, Component: any): any => {
  currentlyRenderingFiber = workInProgress
  currentlyRenderingFiber.memoizedState = null
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
  const queue = (hook.queue = { pending: null })
  const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue)
  return [hook.memoizedState, dispatch]
}
const updateReducer = (reducer: any, initialArg: any): any => {
  const hook = updateWorkInProgressHook()
  const queue = hook.queue
  const current = currentHook
  const pendingQueue = queue.pending

  if (pendingQueue !== null) {
    const first = pendingQueue.next
    let newState = current.memoizedState
    let update = first
    do {
      const action = update.action
      newState = reducer(newState, action)
      update = update.next
    } while (update !== null && update !== first)
    queue.pending = null
    hook.memoizedState = newState
    queue.lastRenderedState = newState
  }

  const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue)
  return [hook.memoizedState, dispatch]
}

const dispatchAction = (currentlyRenderingFiber: SReactFiber, queue: any, action: any): any => {
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

const mountWorkInProgressHook = (): any => {
  const hook = {
    memoizedState: null,
    queue: null,
    next: null
  }

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}

const updateWorkInProgressHook = (): any => {
  let nextCurrentHook
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate
    nextCurrentHook = current.memoizedState
  } else {
    nextCurrentHook = currentHook.next
  }
  currentHook = nextCurrentHook

  const newHook = {
    memoizedState: currentHook.memoizedState,
    queue: currentHook.queue,
    next: null
  }

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook
  } else {
    workInProgressHook.next = newHook
    workInProgressHook = newHook
  }

  return workInProgressHook
}

const basicStateReducer = (state: any, action: any): any => typeof action === 'function' ? action(state) : action

const HookDispatcherOnMount = {
  useState: mountState,
  useReducer: mountReducer
}
const HookDispatcherOnUpdate = {
  useState: updateState,
  useReducer: updateReducer
}
