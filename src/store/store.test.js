import configureStore from './store'

jest.mock('redux-logger')
const logger = require('redux-logger')

logger.default = jest.fn(() => next => action => next(action))

test('should create store', () => {
  const store = configureStore()
  expect(store).not.toBeUndefined()
})

test('should inject reducer and patch store', () => {
  const data = {
    key: 1,
  }
  const reducer = state => state
  const store = configureStore(null, {
    test1: data,
    test2: null,
  })
  expect(store.getState().test).toBeUndefined()
  store.injectReducer('test1', reducer)
  expect(store.getState().test1).toEqual(data)
  expect(store.getState().test1.key).toEqual(1)
  store.injectReducer('test2', reducer)
  expect(store.getState().test2).toBeUndefined()
})

test('should add logger middleware in dev mode', () => {
  const nodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  configureStore(null)
  expect(logger.default).toBeCalled()
  process.env.NODE_ENV = nodeEnv
})
