# [Recept](https://github.com/halodong/recept) &middot; [![LICENSE](https://img.shields.io/github/license/halodong/recept?style=flat-square)](./LICENSE) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/halodong/recept) [![Build Status](https://app.travis-ci.com/halodong/recept.svg?branch=main)](https://app.travis-ci.com/halodong/recept) [![codecov](https://codecov.io/gh/halodong/recept/branch/main/graph/badge.svg?token=8NNFFY8KNT)](https://codecov.io/gh/halodong/recept) [![NPM Version](https://img.shields.io/npm/v/recept.svg)](https://www.npmjs.com/package/recept)


Lightweight react-like library. Like the name, this project is mainly based on the architectural idea of react, which can feel react more intuitively and concisely, and realizes the reconciliation scheduler, also known as time slice.


- [简体中文](./README-cn.md)

## Why
The code can be very intuitive to feel a certain design pattern or code idea and architecture. The original intention of this repository is to learn and explore the react more intuitively, so in terms of internal implementation, many parts of the code idea are almost the same as react, but The implementation is simplified, so it is more suitable to understand the operation process of the entire reconciliation scheduler. In terms of external performance, the hooks that have been implemented so far are almost the same as react.

## Use

`yarn add recept`

```jsx
import { render, useState } from 'recept'

const App = (props) => {
  const [count, setCount] = useState(0)
  return (
    <>
      <h3>count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

render(<App />, document.getElementById('root'))
```

## Hooks API
- [useState](https://github.com/halodong/recept#usestate)

- [useReducer](https://github.com/halodong/recept#usereducer)

- [useEffect](https://github.com/halodong/recept#useeffect)

- [useLayoutEffect](https://github.com/halodong/recept#uselayouteffect)

- [useCallback](https://github.com/halodong/recept#usecallback)

- [useMemo](https://github.com/halodong/recept#usememo)

- [useRef](https://github.com/halodong/recept#useref)

#### useState

`useState` can add state to a component, it returns an array.

Can be called multiple times within a component, rendered when the component is rendered.

```jsx
const Counter = (props) => {
  const [count, setCount] = useState(0)
  return (
    <>
      <h3>count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}
```

#### useReducer

`useReducer` and `useState` are almost the same, but it requires a `reducer` handler function.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { count: state.count + 1 }
    case 'reduce':
      return { count: state.count - 1 }
  }
}

const App = (props) => {
  const [state, dispatch] = useReducer(reducer, { count: 1 })
  return (
    <div>
      <h2>{state.count}</h2>
      <button onClick={() => dispatch({ type: 'add' })}>+</button>
      <button onClick={() => dispatch({ type: 'reduce' })}>-</button>
    </div>
  )
}
```

#### useEffect

It can execute and clean up side effects, the first parameter is a function, the execution timing is affected by the second parameter, it is asynchronous and does not block the UI.

```js
useEffect(fn)         // every time
useEffect(fn, [])     // only once in a component's life cycle 
useEffect(fn, [dep])  // when property dep changes in a component's life cycle
```

```jsx
const App = ({ title }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}
```

If the function returns a cleanup function and the dependent function is an empty array, it will be executed when the component is unmounted.

```js
useEffect(() => {
  // mount
  return () => {
   // unmount
  }
}, [])
```

#### useLayoutEffect

Uses almost the same way as `useEffect`, but its execution is synchronous and will block the UI.

```jsx
useLayoutEffect(() => {
  // In mount or flag changed, do some thing
}, [flag])
```

#### useMemo

`useMemo` has the same rules as `useEffect`, but `useMemo` returns a cached value.

```jsx
const list = [0,1,2,3]

const el = useMemo(() => {
  return list.map(n=>{
   return <li key={n}>{n}</li>
  })
}, [list])
```

#### useCallback

`useCallback` is based on `useMemo`, which returns a cached function.

```jsx
const cb = useCallback(() => {
  console.log('cached')
}, [])
```

#### useRef

`useRef` will return an object, if mounted on the element, the actual DOM of the element will be assigned to ref.

```jsx
const App = () => {
  useEffect(() => {
    console.log(elRef) // { current: HTMLDIVElement }
  })
  const elRef = useRef(null)
  return <div ref={elRef}>t</div>
}
```
### Fragment

```jsx
const App = () => {
  return <>something</>
}
```
## Contributing

The current project is still in the optimization stage, and will continue to follow the direction of react in the future, adding more comprehensive code comments. You are welcome to make various suggestions, as well as [pr](https://github.com/halodong/recept/pulls) and [issue](https://github.com/halodong/recept/issues/new).

## License

Recept is [MIT licensed](./LICENSE).
