import { h, render, useState } from '../../src'

import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello SReact!</p>
        <p>count is: {count}</p>
        <p>
          <button
            type="button"
            onClick={() => setCount((count: number) => count + 1)}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setCount((count: number) => count - 1)}
          >
            -
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
      </header>
    </div>
  )
}

export default App
