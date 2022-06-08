import { h, useState, useEffect } from '../main'

function EffectDemo(props: any) {
  const [count, setCount] = useState(0)
  const [frash, setFrash] = useState({})

  useEffect(() => {
    console.log('once effect')
  }, [])

  useEffect(() => {
    console.log('empty deps effect mount', document.getElementById('test'))
    return () => {
      console.log('empty deps effect unmount', document.getElementById('test'))
    }
  })

  useEffect(() => {
    console.log('count change mount')
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
