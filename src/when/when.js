import { matchPath } from 'react-router-dom'

export const createWhen = (store, initialState) => {
  const dispatches = []
  let listeners = []
  let currentState = initialState

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
      if (!listener.dispatched || listener.permanent) {
        processListener(newState, listener)
      }
    })
  })

  const when = (predicate, effect, permanent) => {
    const listener = { predicate, effect, permanent }
    if (currentState) {
      listener.prevState = currentState
      listener.dispatched = !!predicate(currentState)
    }
    processListener(store.getState(), listener)
    listeners.push(listener)
  }

  when.clear = () => {
    currentState = store.getState()
    listeners = []
  }

  when.loadOnServer = () => Promise.all(dispatches)

  return when
}

//
// predicates
//

const getPathname = location => location ? `${location.pathname}${location.search}` : ''

export const match = path => (state, prevState) => {
  const pathname = getPathname(state.router.location)

  if (prevState) {
    const prevPathname = prevState && getPathname(prevState.router.location)
    return pathname !== prevPathname ? matchPath(pathname, { path }) : false
  }

  return matchPath(pathname, { path })
}
