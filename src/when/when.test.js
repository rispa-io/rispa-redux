import { LOCATION_CHANGE } from 'react-router-redux'
import { createWhen, match } from './when'
import configureStore from '../store/store'

const dispatchLocationChange = (store, location) => {
  const payload = {
    pathname: location,
    search: '',
  }
  store.dispatch({ type: LOCATION_CHANGE, payload })
}

const testAction = {
  type: 'TEST_ACTION',
}

test('should create when function', () => {
  const store = configureStore()
  const when = createWhen({ store })
  expect(when).not.toBeUndefined()
  expect(when.every).not.toBeUndefined()
  expect(when.clear).not.toBeUndefined()
  expect(when.loadOnServer).not.toBeUndefined()
})

test('should trigger effect on location changes', () => {
  const store = configureStore()
  const when = createWhen({ store })
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  expect(effect.mock.calls.length).toBe(0)
  dispatchLocationChange(store, '/path')
  expect(effect.mock.calls.length).toBe(1)
})

test('should trigger effect on `when` registration if current location matches', () => {
  const store = configureStore()
  const when = createWhen({ store })
  const effect = jest.fn().mockReturnValue(testAction)
  dispatchLocationChange(store, '/path')
  when(match('/path'), effect)
  expect(effect.mock.calls.length).toBe(1)
})

test('should trigger effect on each location change if when.every used', () => {
  const store = configureStore()
  const when = createWhen({ store })
  const effect = jest.fn().mockReturnValue(testAction)
  const effectPermanent = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  when.every(match('/pathPermanent'), effectPermanent)
  dispatchLocationChange(store, '/path')
  dispatchLocationChange(store, '/pathPermanent')
  dispatchLocationChange(store, '/path')
  dispatchLocationChange(store, '/pathPermanent')
  expect(effect.mock.calls.length).toBe(1)
  expect(effectPermanent.mock.calls.length).toBe(2)
})

test('should not trigger effect if when already registered', () => {
  const store = configureStore()
  dispatchLocationChange(store, '/path')
  const when = createWhen({ store })
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect, 'key')
  when(match('/path'), effect, 'key')
  expect(effect.mock.calls.length).toBe(1)
})

test('should clear listeners', () => {
  const store = configureStore()
  const when = createWhen({ store })
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  when.clear()
  dispatchLocationChange(store, '/path')
  expect(effect.mock.calls.length).toBe(0)
})

test('loadOnServer should wait for all effects being dispatched', done => {
  const store = configureStore()
  const when = createWhen({ store })
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  dispatchLocationChange(store, '/path')
  when.loadOnServer().then(() => {
    expect(effect.mock.calls.length).toBe(1)
    done()
  })
})
