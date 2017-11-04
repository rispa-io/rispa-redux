'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function (params) {
  var api = params.api,
      name = params.name,
      _params$normalize = params.normalize,
      normalize = _params$normalize === undefined ? defaultNormalize : _params$normalize;

  var fetch = (0, _reduxAct.createAction)(name + '/fetch');
  var fetchSuccess = (0, _reduxAct.createAction)(name + '/fetchSuccess');
  var fetchFailure = (0, _reduxAct.createAction)(name + '/fetchFailure');

  var request = function request(args) {
    return api(args).then(fetchSuccess).catch(fetchFailure);
  };

  var handleFetch = function handleFetch(state, args) {
    return (0, _reduxLoop.loop)((0, _extends3.default)({}, state, {
      isLoaded: false,
      isLoading: true,
      isFailed: false,
      error: undefined
    }), _reduxLoop.Effects.promise(request, args));
  };

  var handleFetchSuccess = function handleFetchSuccess(state, payload) {
    return (0, _extends3.default)({}, state, {
      isLoaded: true,
      isLoading: false,
      isFailed: false
    }, normalize(payload.data));
  };

  var handleFetchFailure = function handleFetchFailure(state, payload) {
    return (0, _extends3.default)({}, state, {
      isLoaded: false,
      isLoading: false,
      isFailed: true,
      error: String(payload)
    });
  };

  var reducer = (0, _reduxAct.createReducer)(function (on) {
    on(fetch, handleFetch);
    on(fetchSuccess, handleFetchSuccess);
    on(fetchFailure, handleFetchFailure);
  }, (0, _extends3.default)({}, initialState, params.data));

  reducer.key = name;
  reducer.getIsLoaded = function (state) {
    return state[name].isLoaded;
  };
  reducer.getIsLoading = function (state) {
    return state[name].isLoading;
  };
  reducer.getIsFailed = function (state) {
    return state[name].isFailed;
  };
  reducer.getData = function (state) {
    return state[name].data;
  };
  reducer.getError = function (state) {
    return state[name].error;
  };

  return {
    reducer: reducer,
    request: request,
    fetch: fetch,
    fetchSuccess: fetchSuccess,
    fetchFailure: fetchFailure
  };
};

var _reduxAct = require('redux-act');

var _reduxLoop = require('@csssr/redux-loop');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  isLoaded: false,
  isLoading: false,
  isFailed: false,
  data: {},
  error: undefined
};

var defaultNormalize = function defaultNormalize(data) {
  return { data: data };
};