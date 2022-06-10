import { h, useMemo, useState, useEffect } from '../src/index'
import { asyncSetState, testRender } from './testUtil'

test('useMemo', async () => {
  let noChangeListRender: any
  let changeListRender: any
  let list: any = []
  let effect: any = () => {}
  const Component = () => {
    const [number, setNumber] = useState(0)
    const [listArr, setListArr] = useState([0, 1, 2, 3])

    useEffect(effect)

    noChangeListRender = setNumber
    changeListRender = setListArr

    const elList = useMemo(() => {
      return listArr.map((n: number) => {
        return <li key={n}>{n}</li>
      })
    }, [listArr])

    list.push(elList)

    return <ul>111</ul>
  }

  await testRender(<Component />)

  await asyncSetState(noChangeListRender, 100, (resolve: Function) => {
    effect = () => {
      resolve(null)
    }
  })
  expect(list[0] === list[1]).toBe(true)

  list.pop()

  await asyncSetState(changeListRender, [100], (resolve: Function) => {
    effect = () => {
      resolve(null)
    }
  })

  expect(list[0] === list[1]).toBe(false)
})
