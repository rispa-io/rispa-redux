/* eslint-disable global-require */
import { applyMiddleware, compose as defaultCompose, createStore } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { combineReducers, install as installReduxLoop } from 'redux-loop'

import whenReducer from '../when/reducer'

const patchStore = (store, key, data) => {
  const state = store.getState()
  state[key] = data
}

const configureStore = ({ history, data, customCompose } = {}) => {
  const reducers = {
    router: connectRouter(history),
    when: whenReducer,
  }
  const middlewares = []

  if (process.env.NODE_ENV === 'development') {
    if (process.env.SSR) {
      middlewares.push(require('redux-node-logger')())
    } else {
      middlewares.push(require('redux-logger').createLogger())
    }
  }
  middlewares.push(routerMiddleware(history))

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

  const store = finalCreateStore(combineReducers(reducers), data)

  store.injectReducer = (key, reducer) => {
    if (data && data[key]) {
      patchStore(store, key, data[key])
    }

    reducers[key] = reducer
    store.replaceReducer(combineReducers(reducers))
  }

  store.addHelper = addHelper

  return store
}

export default configureStore
