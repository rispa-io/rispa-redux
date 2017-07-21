import { matchPath } from 'react-router-dom'
import whenReducer, { register } from './reducer'

export const createWhen = store => {
  const dispatches = []
  let listeners = []

  const processListener = (newState, listener) => {
    const { prevState, predicate, effect } = listener
    listener.prevState = newState
    if (predicate(newState, prevState)) {
      dispatches.push(store.dispatch(effect(newState)))
      listener.dispatched = true
    }
  }

  store.subscribe(() => {
    const newState = store.getState()

    listeners.forEach(listener => {
      if (!listener.dispatched || listener.every) {
        processListener(newState, listener)
      }
    })
  })

  const registerListener = listener => {
    const { key, predicate } = listener
    const state = store.getState()
    const keys = whenReducer.getKeys(state)

    if (keys.indexOf(key) === -1) {
      if (key) {
        store.dispatch(register(key))
      }
      processListener(store.getState(), listener)
    } else {
      listener.dispatched = !!predicate(state)
      listener.prevState = state
    }

    listeners.push(listener)
  }

  const whenOnce = (predicate, effect, key) => {
    registerListener({ predicate, effect, key })
  }

  const whenEvery = (predicate, effect, key) => {
    registerListener({ predicate, effect, key, every: true })
  }

  const loadOnServer = () => {
    if (dispatches.length === 0) {
      return true
    }

    return dispatches.shift()
      .then(loadOnServer)
  }

  const clearListeners = () => {
    listeners = []
  }

  const when = whenOnce
  when.every = whenEvery
  when.loadOnServer = loadOnServer
  when.clear = clearListeners

  return when
}

//
// predicates
//

const getPathname = location =>
  location ? `${location.pathname}${location.search}` : ''

export const match = path => (state, prevState) => {
  const pathname = getPathname(state.router.location)

  if (prevState) {
    const prevPathname = prevState && getPathname(prevState.router.location)
    return pathname !== prevPathname ? matchPath(pathname, { path }) : false
  }

  return matchPath(pathname, { path })
}
