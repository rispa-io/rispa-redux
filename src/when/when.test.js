import { LOCATION_CHANGE } from 'react-router-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import routerMiddleware from 'react-router-redux/middleware'
import { routerReducer } from 'react-router-redux/reducer'
import { createWhen, match } from './when'

const configureStore = () => compose(
  applyMiddleware(routerMiddleware()),
)(createStore)(combineReducers({
  router: routerReducer,
}))

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
  const when = createWhen(store)
  expect(when).not.toBeUndefined()
  expect(when.clear).not.toBeUndefined()
  expect(when.loadOnServer).not.toBeUndefined()
})

test('should tirgger effect on location changes', () => {
  const store = configureStore()
  const when = createWhen(store)
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  expect(effect.mock.calls.length).toBe(0)
  dispatchLocationChange(store, '/path')
  expect(effect.mock.calls.length).toBe(1)
})

test('should tirgger effect on `when` registration if current location matches', () => {
  const store = configureStore()
  const when = createWhen(store)
  const effect = jest.fn().mockReturnValue(testAction)
  dispatchLocationChange(store, '/path')
  when(match('/path'), effect)
  expect(effect.mock.calls.length).toBe(1)
})

test('should tirgger effect on each location change if `permanent` parameter used', () => {
  const store = configureStore()
  const when = createWhen(store)
  const effect = jest.fn().mockReturnValue(testAction)
  const effectPermanent = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  when(match('/pathPermanent'), effectPermanent, true)
  dispatchLocationChange(store, '/path')
  dispatchLocationChange(store, '/pathPermanent')
  dispatchLocationChange(store, '/path')
  dispatchLocationChange(store, '/pathPermanent')
  expect(effect.mock.calls.length).toBe(1)
  expect(effectPermanent.mock.calls.length).toBe(2)
})

test('should not tirgger effect if already dispatched', () => {
  const store = configureStore()
  dispatchLocationChange(store, '/path')
  const when = createWhen(store, store.getState())
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  expect(effect.mock.calls.length).toBe(0)
})

test('should clear listeners', () => {
  const store = configureStore()
  const when = createWhen(store)
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  when.clear()
  dispatchLocationChange(store, '/path')
  expect(effect.mock.calls.length).toBe(0)
})

test('loadOnServer should wait for all effects being dispatched', done => {
  const store = configureStore()
  const when = createWhen(store)
  const effect = jest.fn().mockReturnValue(testAction)
  when(match('/path'), effect)
  dispatchLocationChange(store, '/path')
  when.loadOnServer().then(() => {
    expect(effect.mock.calls.length).toBe(1)
    done()
  })
})
