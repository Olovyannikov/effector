import {createStore, Store} from 'effector'

it('stack safe', () => {
  const DEPTH = 10000
  const src: Store<number> = createStore(0)
  let current = src
  for (let i = 0; i < DEPTH; i++) {
    current = current.map(n => n + 1)
  }
  expect(current.getState()).toBe(DEPTH)
})
