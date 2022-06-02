import { h, render, useState } from '../../src'
import './index.css'

function Counter (props: { count: any }) {
  const [count,setCount] = useState(props.count)

  return <div>
    <h3>计数器:
      count {count >= 0 ? '>=':'<'} 0
    </h3>
    <button key="btn1" onClick={()=>setCount(count+1)}>+</button>
    {count}
    {count >0 && '大于0'}
    <button key="btn2"onClick={()=>setCount(count-1)}>-</button>
  </div>
}

function App () {
  return <div>
    <Counter count={1}/>
    <footer>sreact</footer>
  </div>
}
render(<App key="root" />, document.getElementById('root')!)
