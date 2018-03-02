import { createReducer, createAction } from 'redux-act'

const initialState = {
  keys: [],
}

export const register = createAction(`WHEN/REGISTER`)

const handleRegister = (state, key) => ({
  keys: [
    ...state.keys,
    key,
  ],
})

const reducer = createReducer(on => {
  on(register, handleRegister)
}, initialState)

reducer.key = 'when'

reducer.getKeys = state => state[reducer.key].keys

export default reducer
