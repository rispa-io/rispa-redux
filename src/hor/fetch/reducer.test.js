import { Cmd, getModel, getCmd } from '@csssr/redux-loop'
import fetchGenerator from './reducer'

const REDUCER_KEY = 'TEST'
const apiMock = jest.fn().mockReturnValue(new Promise(() => {}))
const wrapState = state => ({
  [REDUCER_KEY]: state,
})

describe('fetchGenerator with default normalization', () => {
  const {
    reducer,
    fetch,
    fetchSuccess,
    fetchFailure,
  } = fetchGenerator({
    name: REDUCER_KEY,
    api: apiMock,
  })

  const {
    getIsLoading,
    getIsLoaded,
    getIsFailed,
    getError,
    getData,
  } = reducer

  test('should have initialState', () => {
    expect(reducer()).not.toBe(undefined)
  })

  test('should send request on fetch', () => {
    const params = {}
    const actual = getCmd(reducer(undefined, fetch(params)))
    expect(actual).toEqual(Cmd.run(apiMock, {
      successActionCreator: fetchSuccess,
      failActionCreator: fetchFailure,
      args: [params],
    }))
  })

  test('should set correct state flags on fetch', () => {
    const state = wrapState(getModel(reducer(undefined, fetch())))

    expect(getIsLoaded(state)).toBe(false)
    expect(getIsLoading(state)).toBe(true)
    expect(getIsFailed(state)).toBe(false)
  })

  test('should set correct loading flags on response success', () => {
    const payload = {}

    const state = wrapState(getModel(reducer({
      isLoading: true,
      isLoaded: false,
      isFailed: false,
    }, fetchSuccess(payload))))

    expect(getIsLoaded(state)).toBe(true)
    expect(getIsLoading(state)).toBe(false)
    expect(getIsFailed(state)).toBe(false)
  })

  test('should set correct loading flags on response failure', () => {
    const payload = {}

    const state = wrapState(getModel(reducer({
      isLoading: true,
      isLoaded: false,
      isFailed: false,
    }, fetchFailure(payload))))

    expect(getIsLoaded(state)).toBe(false)
    expect(getIsLoading(state)).toBe(false)
    expect(getIsFailed(state)).toBe(true)
  })

  test('should save payload to `data` attribute of the state', () => {
    const payload = {
      data: {},
    }

    const state = wrapState(getModel(reducer(undefined, fetchSuccess(payload))))

    expect(getData(state)).toBe(payload.data)
  })

  test('should save error response to `error` attribute of the state', () => {
    const payload = 'Error'

    const state = wrapState(getModel(reducer(undefined, fetchFailure(payload))))

    expect(getError(state)).toBe(payload)
  })
})

describe('fetchGenerator with custom normalization', () => {
  const {
    reducer,
    fetchSuccess,
  } = fetchGenerator({
    name: REDUCER_KEY,
    normalize: data => ({ customProp: data }),
  })

  test('should normalize data on response success', () => {
    const payload = {
      data: {},
    }
    const state = wrapState(getModel(reducer(undefined, fetchSuccess(payload))))

    expect(state[REDUCER_KEY].customProp).toBe(payload.data)
  })
})
