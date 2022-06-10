import { h, useState } from '../src/index'
import { testUpdates } from './testUtil'

test('update', async () => {
  let updates = 0

  const Component = (props: any) => {
    const [count, setState] = useState(0)
    updates++
    const asyncUp = () => {
      for (let i = 0; i <= 10; i++) {
        setState(() => i)
      }
    }
    return <button onClick={asyncUp}>{count}</button>
  }

  await testUpdates([
    {
      content: <Component />,
      test: ([button]: any) => {
        expect(button.textContent).toEqual('0')
        expect(updates).toEqual(1)
        updates = 0
        button.click()
      },
    },
    {
      content: <Component />,
      test: ([button]: any) => {
        expect(button.textContent).toEqual('10')
        expect(updates).toEqual(1)
      },
    },
  ])
})
