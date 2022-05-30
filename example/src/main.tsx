import { h, render, useState } from '../../src'
// import App from './App'
import './index.css'

export default function App() {
  const [counter, setCounter] = useState(0)

  return (
    <div key="A1">
      <div key="B1">11</div>
      <div key="B2">
        <button key="C1" onClick={()=>setCounter(counter+1)}>+</button>
        counter: <span>{counter}</span>
      </div>
    </div>
  )
}
render(<App key="root" />, document.getElementById('root')!)
