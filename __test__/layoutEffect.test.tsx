import { h, useLayoutEffect } from '../src/index'
import { testUpdates } from './testUtil'

test('useLayoutEffect', async () => {
  expect.assertions(2)
  let effects: any = []

  const effect = () => {
    effects.push(`mount`)
    return () => {
      effects.push(`unmount`)
    }
  }

  const Component = () => {
    useLayoutEffect(effect)

    return <div>foo</div>
  }

  await testUpdates([
    {
      content: <Component />,
      test: () => {
        expect(effects).toEqual(['mount'])
      },
    },
    {
      content: <div>removed</div>,
      test: () => {
        expect(effects).toEqual(['mount', 'unmount'])
      },
    },
  ])
})
