import configureStore from './store'

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
    test: data,
  })
  expect(store.getState().test).toBeUndefined()
  store.injectReducer('test', reducer)
  expect(store.getState().test).toEqual(data)
  expect(store.getState().test.key).toEqual(1)
})
