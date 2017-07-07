import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import routerMiddleware from 'react-router-redux/middleware'
import { routerReducer } from 'react-router-redux/reducer'
import { install as installReduxLoop, combineReducers } from '@csssr/redux-loop'

const patchStore = (store, key, data) => {
  const state = store.getState()
  state[key] = data
}

const makeRootReducer = asyncReducers => combineReducers({
  router: routerReducer,
  ...asyncReducers,
})

const configureStore = (history, data, customCompose) => {
  const reduxRouterMiddleware = routerMiddleware(history)

  const middlewares = []
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger)
  }
  middlewares.push(reduxRouterMiddleware)

  const composeEnhancers = customCompose || compose

  const finalCreateStore = composeEnhancers(
    installReduxLoop(),
    applyMiddleware(...middlewares),
  )(createStore)

  const store = finalCreateStore(makeRootReducer(), data)

  //
  // async reducers
  //

  const asyncReducers = {}

  store.injectReducer = (key, reducer) => {
    if (data && data[key]) {
      patchStore(store, key, data[key])
    }

    asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(asyncReducers))
  }

  return store
}

export default configureStore
