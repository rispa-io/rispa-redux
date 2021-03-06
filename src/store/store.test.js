import configureStore from './store'

jest.mock('redux-logger')
const logger = require.requireMock('redux-logger')

logger.createLogger = jest.fn(() => () => next => action => next(action))

describe('store', () => {
  afterAll(() => {
    delete process.env.SSR
  })

  test('should create store', () => {
    const store = configureStore({})
    expect(store).not.toBeUndefined()
  })

  test('should inject reducer and patch store', () => {
    const data = {
      key: 1,
    }
    const reducer = state => state
    const store = configureStore({
      ssr: true,
      data: {
        test1: data,
        test2: null,
      },
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
    delete process.env.SSR
    configureStore({})
    expect(logger.createLogger).toBeCalled()
    process.env.NODE_ENV = nodeEnv
  })

  test('should register helper', () => {
    const reducer = jest.fn()
    const helper = {}
    const store = configureStore({})
    store.injectReducer('reducer', reducer)
    store.addHelper('helper', helper)
    store.dispatch({ type: 'TEST' })
    expect(reducer).toBeCalledWith(undefined, {
      type: 'TEST',
      helpers: { helper },
    })
  })
})
