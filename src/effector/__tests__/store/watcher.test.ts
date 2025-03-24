import {createStore, createEvent} from 'effector'
import {argumentHistory, muteErrors} from 'effector/fixtures'

muteErrors('watch second argument')

it('support watchers for event', () => {
  const fn = jest.fn()
  const event = createEvent<number | void>()
  const watcher = event.watch(e => {
    fn(e)
  })

  event(3)
  event()
  event(1)

  expect(fn).toBeCalledTimes(3)
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          3,
          undefined,
          1,
        ]
    `)

  watcher()

  event(4)
  expect(fn).toBeCalledTimes(3)
})

it('support watchers for storages', () => {
  const fn = jest.fn()
  const event = createEvent<number>()
  const store = createStore('none').on(event, (_, e) => e.toString())
  const watcher = store.watch(e => {
    fn(e)
  })

  event(3)
  event(1)

  expect(fn).toBeCalledTimes(3)
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          "none",
          "3",
          "1",
        ]
    `)

  watcher()

  event(4)
  expect(fn).toBeCalledTimes(3)
})

it('support event watchers for storages', () => {
  const fn = jest.fn()
  const event = createEvent<number>()
  const update = createEvent<(x: number) => number>()
  const store = createStore(0).on(update, (s, fn) => fn(s))

  const watcher = event.watch(e => fn(e))

  const watcher2 = store.watch(event)

  update(a => a + 2)
  update(a => a + 10)

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      2,
      12,
    ]
  `)

  watcher()
  watcher2()
})

it('support event watchers for storages', () => {
  const fn = jest.fn()
  const trigger = createEvent()
  const store = createStore(0)

  const watcher = store.watch(trigger, fn)

  trigger()
  trigger()
  trigger()

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      0,
      0,
    ]
  `)

  watcher()
})

it('support watchers for mapped storages', () => {
  const addMetaTag = (tag: string, unit: any) => {
    unit.graphite.scope.tag = tag
  }
  const fn = jest.fn()
  const event = createEvent<number>()
  const storeFirst = createStore('none').on(event, (_, e) => e.toString())
  const store = storeFirst.map(e => `/${e}`)

  addMetaTag('event', event)
  addMetaTag('storeFirst', storeFirst)
  addMetaTag('store', store)

  const watcher = store.watch(e => {
    fn(e)
  })

  event(3)

  expect(fn).toBeCalledTimes(2)
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          "/none",
          "/3",
        ]
    `)

  watcher()

  event(4)
  expect(fn).toBeCalledTimes(2)
})

test('watch validation', () => {
  const store = createStore(null)
  expect(() => {
    //@ts-expect-error
    store.watch(NaN)
  }).toThrowErrorMatchingInlineSnapshot(
    `".watch argument should be a function"`,
  )
})
