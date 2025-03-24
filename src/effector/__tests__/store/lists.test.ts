import {
  createStore,
  createApi,
  EventCallable,
  Store,
  StoreWritable,
  createEvent,
} from 'effector'

import {muteErrors} from 'effector/fixtures'

/** this module really old but contains interesting ideas */
muteErrors('watch second argument')

test('list', () => {
  const done = createEvent()
  const list = storeList([' >'])
  const acc = createStore<string[][]>([])
  acc.watch(list.self, (acc, list) => {
    acc.push(list)
  })
  acc.watch(done, lists => {
    // console.log(lists.map(list => list.join(' ')).join(`\n`))
  })

  list.insert([
    {
      offset: 0,
      entries: ['⚫️', '⚫️', '⚫️'],
    },
  ])
  list.insert([
    {
      offset: 1,
      entries: ['🔴', '🔴', '🔴'],
    },
  ])
  list.insert([
    {
      offset: 0,
      entries: ['0️⃣', '   '],
    },
    {
      offset: -1,
      entries: ['🔟'],
    },
  ])

  list.replace([
    {
      offset: 0,
      entries: ['🔵', '🔵'],
    },
    {
      offset(list, entries) {
        return list.length - Math.min(entries.length, list.length)
      },
      entries: ['✳️ ', '✳️ '],
    },
  ])

  list.delete([
    {
      offset: 3,
      amount: 2,
    },
    {
      offset: -1,
      amount: 1,
    },
  ])

  done()

  function storeList<T>(initials: Array<T>): {
    self: Store<Array<T>>
    watch: Store<Array<T>>['watch']
    on: StoreWritable<Array<T>>['on']
    swap: EventCallable<
      Array<
        [
          number | ((list: Array<T>) => number),
          number | ((list: Array<T>) => number),
        ]
      >
    >
    move: EventCallable<
      Array<
        [
          number | ((list: Array<T>) => number),
          number | ((list: Array<T>) => number),
        ]
      >
    >
    insert: EventCallable<
      Array<{
        offset: number | ((list: Array<T>, entries: Array<T>) => number)
        entries: Array<T>
      }>
    >
    replace: EventCallable<
      Array<{
        offset: number | ((list: Array<T>, entries: Array<T>) => number)
        entries: Array<T>
      }>
    >
    update: EventCallable<
      Array<{
        index: number | ((list: Array<T>) => number)
        updater: (value: T) => T
      }>
    >
    delete: EventCallable<
      Array<{
        offset: number | ((list: Array<T>) => number)
        amount: number
      }>
    >

    // Simple actions
    push: EventCallable<Array<T>>
    unshift: EventCallable<Array<T>>
    reverse: EventCallable<void>
    shift: EventCallable<void>
    pop: EventCallable<void>
    clear: EventCallable<void>
  } {
    const store = createStore(initials)
    const reducers = {
      insert(
        state: Array<T>,
        segments: Array<{
          offset: number | ((list: Array<T>, entries: Array<T>) => number)
          entries: Array<T>
        }>,
      ) {
        if (segments.length === 0) return state
        const store = []
        const newSegments = sortSegments(segments, state)
        for (let i = 0; i < state.length; i++) {
          const item = state[i]
          for (let j = 0; j < newSegments.length; j++) {
            if (newSegments[j].offset !== i) continue
            store.push(...newSegments[j].entries)
          }
          store.push(item)
        }
        for (let i = 0; i < newSegments.length; i++) {
          if (newSegments[i].offset >= state.length) {
            store.push(...newSegments[i].entries)
          }
        }
        return store
      },
      replace(
        state: Array<T>,
        segments: Array<{
          offset: number | ((list: Array<T>, entries: Array<T>) => number)
          entries: Array<T>
        }>,
      ) {
        if (segments.length === 0) return state
        const store = [...state]
        const newSegments = sortSegments(segments, state)
        for (let i = 0; i < newSegments.length; i++) {
          const {entries, offset} = newSegments[i]
          for (let j = 0; j < entries.length; j++) {
            store[j + offset] = entries[j]
          }
        }
        return store
      },
      update(
        state: Array<T>,
        segments: Array<{
          index: number | ((list: Array<T>) => number)
          updater: (value: T) => T
        }>,
      ) {
        if (segments.length === 0) return state
        const store = [...state]
        const newSegments: Array<{
          index: number
          updater(value: T): T
        }> = segments
          .map(({updater, index}) => ({
            updater,
            index: normalizeOffset<T>(index, state, []),
          }))
          .sort((a, b) => a.index - b.index)
        for (let i = 0; i < newSegments.length; i++) {
          const {updater, index} = newSegments[i]
          store[index] = updater(store[index])
        }
        return store
      },
      delete(
        state: Array<T>,
        segments: Array<{
          offset: number | ((list: Array<T>) => number)
          amount: number
        }>,
      ) {
        if (segments.length === 0) return state
        const store = [...state]
        const newSegments = []
        for (let j = 0; j < segments.length; j++) {
          const segment = segments[j]
          newSegments.push({
            offset: normalizeOffset(segment.offset, state, []),
            amount: segment.amount,
          })
        }
        newSegments.sort((a, b) => a.offset - b.offset)
        const ids = Array(store.length).fill(true)
        for (let i = 0; i < newSegments.length; i++) {
          const {amount, offset} = newSegments[i]
          for (let j = 0; j < amount; j++) {
            ids[j + offset] = false
          }
        }
        return store.filter((_, i) => ids[i])
      },
      move(
        state: Array<T>,
        segments: Array<
          [
            number | ((list: Array<T>) => number),
            number | ((list: Array<T>) => number),
          ]
        >,
      ) {
        if (segments.length === 0) return state
        const store = [...state]
        const newSegments: Array<{
          from: number
          to: number
        }> = segments
          .map(([indexA, indexB]) => ({
            from: normalizeOffset<T>(indexA, state, []),
            to: normalizeOffset<T>(indexB, state, []),
          }))
          .sort((a, b) => a.from - b.from)
        for (let i = 0; i < newSegments.length; i++) {
          const {from, to} = newSegments[i]
          const value = store[from]
          store.splice(from, 1)
          store.splice(to, 0, value)
        }
        return store
      },
      swap(
        state: Array<T>,
        segments: Array<
          [
            number | ((list: Array<T>) => number),
            number | ((list: Array<T>) => number),
          ]
        >,
      ) {
        if (segments.length === 0) return state
        const store = [...state]
        const newSegments: Array<{
          from: number
          to: number
        }> = segments
          .map(([indexA, indexB]) => ({
            from: normalizeOffset<T>(indexA, state, []),
            to: normalizeOffset<T>(indexB, state, []),
          }))
          .sort((a, b) => a.from - b.from)
        for (let i = 0; i < newSegments.length; i++) {
          const {from, to} = newSegments[i]
          const value = store[from]
          store[from] = store[to]
          store[to] = value
        }
        return store
      },

      // Simple actions
      reverse(state: Array<T>, payload: void) {
        const store = [...state]
        store.reverse()
        return store
      },
      shift(state: Array<T>, payload: void) {
        const store = [...state]
        store.shift()
        return store
      },
      pop(state: Array<T>, payload: void) {
        const store = [...state]
        store.pop()
        return store
      },
      clear(state: Array<T>, payload: void) {
        return []
      },
    }
    const model = {
      store,
      api: createApi(store, reducers),
    }

    return {
      delete: model.api.delete,
      insert: model.api.insert,
      update: model.api.update,
      replace: model.api.replace,
      move: model.api.move,
      swap: model.api.swap,

      // Simple actions
      push: model.api.insert.prepend(entries => [
        {
          offset: -1,
          entries,
        },
      ]),
      unshift: model.api.insert.prepend(entries => [
        {
          offset: 0,
          entries,
        },
      ]),
      clear: model.api.clear,
      pop: model.api.pop,
      reverse: model.api.reverse,
      shift: model.api.shift,

      watch: model.store.watch,
      on: model.store.on,
      self: model.store,
    }
  }
  function normalizeOffset<T>(
    offsetRaw: number | ((list: Array<T>, entries: Array<T>) => number),
    list: Array<T>,
    entries: Array<T>,
  ): number {
    let offset
    if (typeof offsetRaw === 'function') offset = offsetRaw(list, entries)
    else offset = offsetRaw
    if (offset < 0) offset = list.length + offset + 1
    return offset
  }
  function sortSegments<T>(
    segments: Array<{
      entries: Array<T>
      offset: number | ((list: Array<T>, entries: Array<T>) => number)
    }>,
    list: Array<T>,
  ): Array<{entries: Array<T>; offset: number}> {
    return segments
      .map(
        ({
          entries,
          offset,
        }): {
          entries: Array<T>
          offset: number
        } => ({
          entries,
          offset: normalizeOffset<T>(offset, list, entries),
        }),
      )
      .sort((a, b) => a.offset - b.offset)
  }
})
