import { h } from '../src/index'
import { testUpdates } from './testUtil'

test('style', async () => {
  await testUpdates([
    {
      content: <h1 style={{ color: 'red' }} />,
      test: ([h1]: HTMLElement[]) => {
        expect(h1.style.color).toEqual('red')
      },
    },
    {
      content: <div />,
      test: ([div]: HTMLElement[]) => {
        expect(div.style.color).toEqual('')
      },
    },
  ])
})
