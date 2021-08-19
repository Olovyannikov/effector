import {createDomain, scopeBind, fork, allSettled} from 'effector'

it('bind result to current promise when called from watch', async () => {
  const app = createDomain()
  const trigger = app.createEvent()
  const inc = app.createEvent()
  const $count = app.createStore(0).on(inc, x => x + 1)

  let fn: () => void

  trigger.watch(() => {
    fn = scopeBind(inc)
  })

  const scope = fork(app)
  await allSettled(trigger, {scope})
  fn!()
  expect(scope.getState($count)).toBe(1)
  expect($count.getState()).toBe(0)
})

it('will throw an error when used without watch nor explicit {scope}', () => {
  const app = createDomain()
  const trigger = app.createEvent()

  expect(() => {
    scopeBind(trigger)
  }).toThrowErrorMatchingInlineSnapshot(
    `"scopeBind cannot be called outside of forked .watch"`,
  )
})

it('support explicit {scope}', async () => {
  const app = createDomain()
  const inc = app.createEvent()
  const $count = app.createStore(0).on(inc, x => x + 1)

  const scope = fork(app)

  const scopeInc = scopeBind(inc, {scope})

  scopeInc()

  expect(scope.getState($count)).toBe(1)
  expect($count.getState()).toBe(0)
})

it('returns promise when used with effect', async () => {
  const app = createDomain()
  const fx = app.createEffect(() => 'ok')

  const scope = fork(app)
  const scopeFx = scopeBind(fx, {scope})

  const req = scopeFx()
  expect(req instanceof Promise).toBe(true)
})
