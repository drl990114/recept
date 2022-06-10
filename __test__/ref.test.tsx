import { h, useRef } from '../src/index'
import { testUpdates } from './testUtil'

test('ref render', async () => {
  let refs: string[] = []
  const Component = () => {
    const ref = useRef('')
    const p = (dom: HTMLElement | null) => {
      if (dom) {
        refs.push('ref')
      } else {
        refs.push('cleanup')
      }
    }
    const c = (dom: HTMLElement | null) => {
      if (dom) {
        refs.push('ref2')
      } else {
        refs.push('cleanup2')
      }
    }
    return (
      <div ref={p}>
        <p ref={c}>before</p>
        <span>{ref.current}</span>
      </div>
    )
  }

  await testUpdates([
    {
      content: <Component />,
      test: (arr:any) => {
        expect(refs).toEqual(['ref2', 'ref'])
        refs = []
      },
    },
    {
      content: <div>removed</div>,
      test: () => {
        expect(refs).toEqual(['cleanup2', 'cleanup'])
      },
    },
  ])
})
