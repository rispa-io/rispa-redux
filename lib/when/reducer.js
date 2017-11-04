'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _reduxAct = require('redux-act');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REDUCER_KEY = 'when';

var initialState = {
  keys: []
};

var register = exports.register = (0, _reduxAct.createAction)(REDUCER_KEY + '/register');

var handleRegister = function handleRegister(state, key) {
  return {
    keys: [].concat((0, _toConsumableArray3.default)(state.keys), [key])
  };
};

var reducer = (0, _reduxAct.createReducer)(function (on) {
  on(register, handleRegister);
}, initialState);

reducer.getKeys = function (state) {
  return state[REDUCER_KEY].keys;
};

exports.default = reducer;