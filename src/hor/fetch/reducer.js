import { createReducer, createAction } from 'redux-act'
import { loop, Effects } from 'redux-loop'

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
  const fetch = createAction(`${name}/fetch`)
  const fetchSuccess = createAction(`${name}/fetchSuccess`)
  const fetchFailure = createAction(`${name}/fetchFailure`)

  const request = args =>
    api(args)
      .then(fetchSuccess)
      .catch(fetchFailure)

  const handleFetch = (state, args) => loop({
    ...state,
    isLoaded: false,
    isLoading: true,
    isFailed: false,
    error: undefined,
  }, Effects.promise(request, args))

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
    request,
    fetch,
    fetchSuccess,
    fetchFailure,
  }
}
