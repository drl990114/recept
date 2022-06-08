import { h } from '../src'

describe('h', () => {
  it('should resolve host components correctly', () => {
    const div = <div></div>
    expect(div).toEqual({
      type: 'div',
      props: { children: [] },
    })
  })

  it('should resolve function components correctly', () => {
    const App = (props: any) => {
      return <div></div>
    }
    expect(<App name="app" key="root" />).toEqual({
      key: 'root',
      type: App,
      props: { key: 'root', name: 'app', children: [] },
    })
  })

  it('Special values should be parsed correctly', () => {
    const div = (
      <div>
        {true}
        {false}
        {'bar'}
        {null}
      </div>
    )
    expect(div).toEqual({
      type: 'div',
      props: {
        children: [
          {
            props: {
              children: [],
              text: 'bar',
            },
            type: '#text',
          },
        ],
      },
    })
  })

  it('Child nodes in array form should be expanded', () => {
    const child = (props: any) => <li {...props}></li>
    const childs = []

    childs.push(child({ key: 'child1' }))
    childs.push(child({ key: 'child2' }))

    const ul = <ul>{childs}</ul>
    expect(ul).toEqual({
      type: 'ul',
      props: {
        children: [
          {
            type: 'li',
            key: 'child1',
            props: {
              key: 'child1',
              children: [],
            },
          },
          {
            type: 'li',
            key: 'child2',
            props: {
              key: 'child2',
              children: [],
            },
          },
        ],
      },
    })
  })
})
