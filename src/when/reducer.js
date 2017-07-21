import { createReducer, createAction } from 'redux-act'

const REDUCER_KEY = 'when'

const initialState = {
  keys: [],
}

export const register = createAction(`${REDUCER_KEY}/register`)

const handleRegister = (state, key) => ({
  keys: [
    ...state.keys,
    key,
  ],
})

const reducer = createReducer(on => {
  on(register, handleRegister)
}, initialState)

reducer.getKeys = state => state[REDUCER_KEY].keys

export default reducer
