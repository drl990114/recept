import { h, render, useState, useEffect } from '../../src'
import './index.css'
// import React, { useEffect, useState } from 'react'
// import { render } from 'react-dom'

function Counter(props: { count: any }) {
  const [count, setCount] = useState(props.count)

  useEffect(() => {
    console.log('effect 挂载', document.getElementById('test'))
    return () => {
      console.log('effect 卸载', document.getElementById('test'))
    }
  })
  return (
    <div id="test">
      <h3>计数器: count {count >= 0 ? '>=' : '<'} 0</h3>
      <button key="btn1" onClick={() => setCount(count + 1)}>
        +
      </button>
      {count}
      {count > 0 && '大于0'}
      <button key="btn2" onClick={() => setCount(count - 1)}>
        -
      </button>
    </div>
  )
}

function App() {
  const [open, setSwitch] = useState(true)
  return (
    <div>
      <button onClick={() => setSwitch(!open)}>
        {open ? '当前：开' : '当前：关'}
      </button>
      {open && <Counter count={1} />}
      <footer>sreact</footer>
    </div>
  )
}
render(<App key="root" />, document.getElementById('root')!)
