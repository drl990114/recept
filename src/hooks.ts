let currentlyRenderingFiber = null

export const renderWithHooks = (current: any, workInProgress: any, Component: any): any => {
  currentlyRenderingFiber = workInProgress
  currentlyRenderingFiber.memoizedState = null

  const children = Component()
  currentlyRenderingFiber = null

  return children
}
