import { h, render, useState } from '../../src'
// import App from './App'
import './index.css'

export default function App() {
  const [counter, setCounter] = useState(0)
  console.log('counter',counter)
  return (
    <div key="A1">
      <div key="B1" style={{fontSize: '30px'}}>计数器</div>
      <button key="C1" onClick={()=>setCounter(counter+1)}>+</button>
        counter: <span>{counter}</span>
    </div>
  )
}
render(<App key="root" />, document.getElementById('root')!)
