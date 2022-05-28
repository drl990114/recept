import { h, render } from '../../src'
// import App from './App'
import './index.css'

export default function App() {
  return <div key="A1">
    <div key="B1">11</div>
    <div key="B2">11</div>
  </div>
}
render(<App key="root"/>, document.getElementById('root')!)
