import {createEvent} from 'effector'

it('can use deep stack calls', () => {
  const fn = jest.fn()
  const a = createEvent<string>()
  const b = createEvent<string>()
  const c = createEvent<string>()
  const d = c.map(_ => _)
  const e = d.map(_ => _)
  const f = createEvent<string>()

  a.watch(data => {
    b(data)
  })
  b.watch(data => {
    c(data)
  })
  e.watch(data => {
    f(data)
  })
  f.watch(data => {
    fn(data)
  })

  a('payload')
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toBeCalledWith('payload')
})
