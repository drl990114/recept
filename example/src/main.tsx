import { h, render, useState, useEffect, useMemo, useRef } from '../../src'
import './index.css'
// import React, { useEffect, useState,useMemo,useRef } from 'react'
// import { render } from 'react-dom'

function Counter(props: any) {
  const [count, setCount] = useState(props.count)
  const div = useRef(null)
  useEffect(() => {
    console.log('effect 挂载', div, document.getElementById('test'))
    return () => {
      console.log('effect 卸载', div, document.getElementById('test'))
    }
  }, [])

  const desc = useMemo(() => {
    console.log('useMemo')
    if (count > 0) {
      return '大于0'
    } else {
      return '小于等于0'
    }
  }, [count > 0])
  console.log('ref', div)
  return (
    <div ref={div} id="test">
      <h3>计数器: count {desc}</h3>
      <button key="btn1" onClick={() => setCount(count + 1)}>
        +
      </button>
      {count}
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
      {open && <Counter count={1} isOpen={open} />}
      <footer>sreact</footer>
    </div>
  )
}

render(<App key="root" />, document.getElementById('root')!)
