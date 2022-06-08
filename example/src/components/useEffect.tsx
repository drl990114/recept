import { h, useState, useEffect } from '../../../src'

function EffectDemo(props: any) {
  const [count, setCount] = useState(0)
  const [frash, setFrash] = useState({})

  useEffect(() => {
    console.log('once')
  }, [])

  useEffect(() => {
    console.log('effect 挂载', document.getElementById('test'))
    return () => {
      console.log('effect 卸载', document.getElementById('test'))
    }
  })

  useEffect(() => {
    console.log('count change')
    return () => {
      console.log('count change unmount')
    }
  }, [count])

  return (
    <div id="test">
      <button onClick={() => setFrash({})}>frash</button>
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

export default EffectDemo
