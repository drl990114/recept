import { h, render, useState } from '../../src'
import './index.css'

function App () {
  const [count,setCount] = useState(0)

  return <div>
    <h3>计数器:
      count {count >= 0 ? '>=':'<'} 0
    </h3>
    <button onClick={()=>setCount(count+1)}>+</button>
    {count}
    {count >0 && '大于0'}

    <button onClick={()=>setCount(count-1)}>-</button>
  </div>
}

render(<App key="root" />, document.getElementById('root')!)
