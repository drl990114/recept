# [Recept](https://github.com/halodong/recept) &middot; [![LICENSE](https://img.shields.io/github/license/halodong/recept?style=flat-square)](./LICENSE) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/halodong/recept) [![Build Status](https://app.travis-ci.com/halodong/recept.svg?branch=main)](https://app.travis-ci.com/halodong/recept) [![codecov](https://codecov.io/gh/halodong/recept/branch/main/graph/badge.svg?token=8NNFFY8KNT)](https://codecov.io/gh/halodong/recept) [![NPM Version](https://img.shields.io/npm/v/recept.svg)](https://www.npmjs.com/package/recept)


轻量的类 react 库。如这个名字一样，该项目主要是基于 react 的架构思想，可以更直观简洁的感受 react ，实现了调和调度程序，也被称为时间切片。

- [English](./README.md)


## Why
代码是可以非常直观的感受某个设计模式或者代码思路以及架构的，本仓库的初衷是为了更直观的学习和探索 react ，所以在内部实现上，很多部分的代码思路几乎与 react 一致，但是实现上有所简化，所以比较适合用来了解整个调和调度程序的运作过程。在外部表现上，目前已经实现的 hook 与 react 几乎一致。

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

`useState` 可以给组件添加状态，它返回一个数组。

可以在组件内多次调用，在渲染组件时呈现。

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

`useReducer` 和 `useState` 几乎是一样的，但它需要一个 `reducer` 处理函数。

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

它可以执行和清理副作用，第一个参数为一个函数，执行时机受第二个参数影响，它是异步的不会阻塞UI。

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

如果函数返回了一个清理函数，会在组件卸载时执行。

```js
useEffect(() => {
  // mount
  return () => {
   // unmount
  }
}, [])
```

#### useLayoutEffect

和 `useEffect` 使用方式几乎一样，但它的执行是同步的会阻塞UI。
```jsx
useLayoutEffect(() => {
  // In mount or flag changed, do some thing
}, [flag])
```

#### useMemo

`useMemo` 与 `useEffect` 规则相同, 但 `useMemo` 会返回一个缓存值。

```js
const list = [0,1,2,3]

const el = useMemo(() => {
  return list.map(n=>{
   return <li key={n}>{n}</li>
  })
}, [list])
```

#### useCallback

`useCallback` 基于 `useMemo`, 它会返回一个缓存的函数.

```js
const cb = useCallback(() => {
  console.log('cached')
}, [])
```

#### useRef

`useRef` 会返回一个对象，如果被挂载到元素上，元素的真实 DOM 会赋值给 ref.

```js
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

当前项目还处于优化阶段，后续也会继续跟进 react 的方向，补充更全面的代码注释，欢迎大家提出各种建议，也欢迎大家提 [pr](https://github.com/halodong/recept/pulls) 和 [issue](https://github.com/halodong/recept/issues/new)

## License

Recept 是基于 [MIT licensed](./LICENSE) 的.
