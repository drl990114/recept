import { h } from '../src'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
    function App() {
      return (
        <div>
          <footer>sreact</footer>
        </div>
      )
    }
    console.log(<App key="1" />)
  })
})
