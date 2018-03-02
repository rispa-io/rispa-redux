/* eslint-disable global-require */
import { applyMiddleware, compose as defaultCompose, createStore } from 'redux'
import routerMiddleware from 'react-router-redux/middleware'
import { routerReducer } from 'react-router-redux/reducer'
import { combineReducers, install as installReduxLoop } from '@csssr/redux-loop'
import { reducer as formReducer } from 'redux-form'
import whenReducer from '../when/reducer'

const patchStore = (store, key, data) => {
  const state = store.getState()
  state[key] = data
}

const makeRootReducer = asyncReducers => combineReducers({
  router: routerReducer,
  form: formReducer,
  when: whenReducer,
  ...asyncReducers,
})

const configureStore = ({ history, data, customCompose } = {}) => {
  const reduxRouterMiddleware = routerMiddleware(history)

  const middlewares = []
  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    if (process.env.SSR) {
      middlewares.push(require('redux-node-logger')())
    } else {
      middlewares.push(require('redux-logger').createLogger())
    }
  }
  middlewares.push(reduxRouterMiddleware)

  // helpers middleware
  const helpers = {}
  const helpersMiddleware = () => next => action => next({ ...action, helpers })
  const addHelper = (key, helper) => {
    helpers[key] = helper
  }
  middlewares.push(helpersMiddleware)

  const compose = customCompose || defaultCompose

  const finalCreateStore = compose(
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

  //
  // add helper
  //

  store.addHelper = addHelper

  return store
}

export default configureStore
