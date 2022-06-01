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
        <h4>
          {count <= 0 && (
            <button
              type="button"
              onClick={() => setCount((count: number) => count + 1)}
            >
              +
            </button>
          )}
          {count > 0 && (
            <button
              type="button"
              onClick={() => setCount((count: number) => count - 1)}
            >
              -
            </button>
          )}
        </h4>
      </header>
    </div>
  )
}

export default App
