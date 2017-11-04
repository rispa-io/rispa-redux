'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _redux = require('redux');

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _middleware = require('react-router-redux/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = require('react-router-redux/reducer');

var _reduxLoop = require('@csssr/redux-loop');

var _reduxForm = require('redux-form');

var _reducer2 = require('../when/reducer');

var _reducer3 = _interopRequireDefault(_reducer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patchStore = function patchStore(store, key, data) {
  var state = store.getState();
  state[key] = data;
};

var makeRootReducer = function makeRootReducer(asyncReducers) {
  return (0, _reduxLoop.combineReducers)((0, _extends3.default)({
    router: _reducer.routerReducer,
    form: _reduxForm.reducer,
    when: _reducer3.default
  }, asyncReducers));
};

var configureStore = function configureStore(history, data, customCompose) {
  var reduxRouterMiddleware = (0, _middleware2.default)(history);

  var middlewares = [];
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(_reduxLogger2.default);
  }
  middlewares.push(reduxRouterMiddleware);

  // helpers middleware
  var helpers = {};
  var helpersMiddleware = function helpersMiddleware() {
    return function (next) {
      return function (action) {
        return next((0, _extends3.default)({}, action, { helpers: helpers }));
      };
    };
  };
  var addHelper = function addHelper(key, helper) {
    helpers[key] = helper;
  };
  middlewares.push(helpersMiddleware);

  var composeEnhancers = customCompose || _redux.compose;

  var finalCreateStore = composeEnhancers((0, _reduxLoop.install)(), _redux.applyMiddleware.apply(undefined, middlewares))(_redux.createStore);

  var store = finalCreateStore(makeRootReducer(), data);

  //
  // async reducers
  //

  var asyncReducers = {};

  store.injectReducer = function (key, reducer) {
    if (data && data[key]) {
      patchStore(store, key, data[key]);
    }

    asyncReducers[key] = reducer;
    store.replaceReducer(makeRootReducer(asyncReducers));
  };

  //
  // add helper
  //

  store.addHelper = addHelper;

  return store;
};

exports.default = configureStore;