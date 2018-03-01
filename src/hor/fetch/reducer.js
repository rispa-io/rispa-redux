import { createReducer, createAction } from 'redux-act'
import { loop, Cmd } from '@csssr/redux-loop'

const initialState = {
  isLoaded: false,
  isLoading: false,
  isFailed: false,
  data: {},
  error: undefined,
}

const defaultNormalize = data => ({ data })

export default function (params) {
  const { api, name, normalize = defaultNormalize } = params
  const fetch = createAction(`${name}/FETCH`, (...args) => args)
  const fetchSuccess = createAction(`${name}/FETCH_SUCCESS`)
  const fetchFailure = createAction(`${name}/FETCH_FAILURE`)

  const handleFetch = (state, args) => loop({
    ...state,
    isLoaded: false,
    isLoading: true,
    isFailed: false,
    error: undefined,
  }, Cmd.run(api, {
    successActionCreator: fetchSuccess,
    failActionCreator: fetchFailure,
    args,
  }))

  const handleFetchSuccess = (state, payload) => ({
    ...state,
    isLoaded: true,
    isLoading: false,
    isFailed: false,
    ...normalize(payload.data),
  })

  const handleFetchFailure = (state, payload) => ({
    ...state,
    isLoaded: false,
    isLoading: false,
    isFailed: true,
    error: String(payload),
  })

  const reducer = createReducer(on => {
    on(fetch, handleFetch)
    on(fetchSuccess, handleFetchSuccess)
    on(fetchFailure, handleFetchFailure)
  }, {
    ...initialState,
    ...params.data,
  })

  reducer.key = name
  reducer.getIsLoaded = state => state[name].isLoaded
  reducer.getIsLoading = state => state[name].isLoading
  reducer.getIsFailed = state => state[name].isFailed
  reducer.getData = state => state[name].data
  reducer.getError = state => state[name].error

  return {
    reducer,
    fetch,
    fetchSuccess,
    fetchFailure,
  }
}
