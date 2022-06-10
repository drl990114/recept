import { h, Fragment } from '../src'

test('fragment', () => {
  expect.assertions(1)
  const empty = (
    <>
      <div></div>
    </>
  )

  expect(empty).toEqual({
    type: 'fragment',
    props: {
      children: [
        {
          type: 'div',
          props: {
            children: [],
          },
        },
      ],
    },
  })
})
