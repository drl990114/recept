import { h, useState, useEffect } from '../src/index'
import { testUpdates } from './testUtil'

test('update', async () => {
  let updates = 0
  const Component = (props: any) => {
    const [count, setCount] = useState(props.count ?? 0)
    updates++

    return <p>{count}</p>
  }

  await testUpdates([
    {
      content: <Component />,
      test: ([button]: any) => {
        expect(button.textContent).toEqual('0')
        expect(updates).toEqual(1)
      },
    },
    {
      content: <Component count={10} />,
      test: ([button]: any) => {
        expect(button.textContent).toEqual('0')
        expect(updates).toEqual(2)
      },
    },
  ])
})
