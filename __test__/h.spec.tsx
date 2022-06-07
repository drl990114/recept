import { h } from '../src'

describe('h', () => {
  it('should resolve host components correctly', () => {
    const div = <div></div>
    expect(div).toEqual({
      props: { children: [] },
      type: 'div',
    })
  })

  it('should resolve function components correctly', () => {
    const App = (props: any) => {
      return <div></div>
    }
    expect(<App name="app" key="root" />).toEqual({
      key: 'root',
      props: { key: 'root', name: 'app', children: [] },
      type: App,
    })
  })
})
