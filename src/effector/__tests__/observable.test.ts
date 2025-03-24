import * as redux from 'redux'
import {from, periodic} from 'most'
import {from as rxjsFrom} from 'rxjs'
import {
  fromObservable,
  createEvent,
  createStore,
  createEffect,
  createDomain,
} from 'effector'
import {argumentHistory} from 'effector/fixtures'

describe('fromObservable', () => {
  it('works with typical Symbol.observable library: redux', () => {
    const fn = jest.fn()
    const reduxStore = redux.createStore((state: number = 1, action) => {
      switch (action.type) {
        case 'inc':
          return state + 1
        default:
          return state
      }
    })
    const effectorEvent = fromObservable(reduxStore)
    effectorEvent.watch(e => {
      fn(e)
    })
    reduxStore.dispatch({type: 'inc'})
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        2,
      ]
    `)
  })

  describe('works with itself', () => {
    test('event support', () => {
      const fn = jest.fn()
      const trigger = createEvent<number>()
      const target = fromObservable(trigger)
      target.watch(fn)
      trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
        ]
      `)
    })
    test('effect support', async () => {
      const fn = jest.fn()
      const trigger = createEffect((x: number) => {})
      const target = fromObservable(trigger)
      target.watch(fn)
      await trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
        ]
      `)
    })
    test('store support', () => {
      const fn = jest.fn()
      const trigger = createEvent()
      const store = createStore(0).on(trigger, x => x + 1)
      const target = fromObservable(store)
      target.watch(fn)
      trigger()
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `)
    })
  })
})

describe('.subscribe', () => {
  describe('observer support', () => {
    test('event support', () => {
      const fn = jest.fn()
      const trigger = createEvent<number>()
      trigger.subscribe({next: fn})
      trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
        ]
      `)
    })
    test('effect support', async () => {
      const fn = jest.fn()
      const trigger = createEffect((x: number) => {})
      trigger.subscribe({next: fn})
      await trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
        ]
      `)
    })
    test('store support', () => {
      const fn = jest.fn()
      const trigger = createEvent<number>()
      const store = createStore(0).on(trigger, x => x + 1)
      store.subscribe({next: fn})
      trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
          1,
        ]
      `)
    })
  })
  describe('function support', () => {
    test('event support', () => {
      const fn = jest.fn()
      const trigger = createEvent<number>()
      //@ts-expect-error untyped feature
      trigger.subscribe(fn)
      trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
        ]
      `)
    })
    test('effect support', async () => {
      const fn = jest.fn()
      const trigger = createEffect((x: number) => {})
      //@ts-expect-error untyped feature
      trigger.subscribe(fn)
      await trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
        ]
      `)
    })
    test('store support', () => {
      const fn = jest.fn()
      const trigger = createEvent<number>()
      const store = createStore(0).on(trigger, x => x + 1)
      store.subscribe(fn)
      trigger(0)
      expect(argumentHistory(fn)).toMatchInlineSnapshot(`
        Array [
          0,
          1,
        ]
      `)
    })
  })
})

describe('port', () => {
  test('port should work correctly', async () => {
    const used = jest.fn()
    const usedEff = jest.fn()
    const domain = createDomain()
    const event = domain.createEvent<number>()
    const eff = domain.createEvent<number>()
    event.watch(used)
    eff.watch(usedEff)
    const str$ = periodic(50)
      .scan(a => a + 1, 0)
      .take(5)
    await Promise.all([str$.map(event).drain(), str$.map(eff).drain()])
    expect(used).toHaveBeenCalledTimes(5)
    expect(usedEff).toHaveBeenCalledTimes(5)
  })
})

it('works with most use cases', async () => {
  const fn = jest.fn()
  const timeout = createEvent()
  timeout.watch(fn)

  await periodic(300)
    .take(5)
    .observe(() => timeout())

  expect(fn).toHaveBeenCalledTimes(5)
})

test('subscription', async () => {
  const fn = jest.fn()

  const domain = createDomain()

  const eff = domain.createEffect()
  eff.use(() => {})
  expect(() => {
    from(eff).observe(fn)
  }).not.toThrow()
  const event = domain.createEvent()
  expect(() => {
    from(event).observe(fn)
  }).not.toThrow()
  event()
  await eff('')
  expect(fn).toHaveBeenCalledTimes(2)
})

test('rxjs support', async () => {
  const fn = jest.fn()
  const event = createEvent<string>()
  //@ts-expect-error not typed properly
  const event$ = rxjsFrom(event)
  const targetEvent = fromObservable(event$)
  targetEvent.watch(fn)
  event('a')
  event('b')
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "a",
      "b",
    ]
  `)
})

test('most support', async () => {
  const fn = jest.fn()
  const event = createEvent<string>()
  const event$ = from(event)
  const targetEvent = fromObservable(event$)
  targetEvent.watch(fn)
  event('a')
  event('b')
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "a",
      "b",
    ]
  `)
})
