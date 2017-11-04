'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.createWhen = undefined;

var _reactRouterDom = require('react-router-dom');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createWhen = exports.createWhen = function createWhen(store) {
  var dispatches = [];
  var listeners = [];

  var processListener = function processListener(newState, listener) {
    var prevState = listener.prevState,
        predicate = listener.predicate,
        effect = listener.effect;

    listener.prevState = newState;
    if (predicate(newState, prevState)) {
      dispatches.push(store.dispatch(effect(newState)));
      listener.dispatched = true;
    }
  };

  store.subscribe(function () {
    var newState = store.getState();

    listeners.forEach(function (listener) {
      if (!listener.dispatched || listener.every) {
        processListener(newState, listener);
      }
    });
  });

  var registerListener = function registerListener(listener) {
    var key = listener.key,
        predicate = listener.predicate;

    var state = store.getState();
    var keys = _reducer2.default.getKeys(state);

    if (keys.indexOf(key) === -1) {
      if (key) {
        store.dispatch((0, _reducer.register)(key));
      }
      processListener(store.getState(), listener);
    } else {
      listener.dispatched = !!predicate(state);
      listener.prevState = state;
    }

    listeners.push(listener);
  };

  var whenOnce = function whenOnce(predicate, effect, key) {
    registerListener({ predicate: predicate, effect: effect, key: key });
  };

  var whenEvery = function whenEvery(predicate, effect, key) {
    registerListener({ predicate: predicate, effect: effect, key: key, every: true });
  };

  var loadOnServer = function loadOnServer() {
    if (dispatches.length === 0) {
      return true;
    }

    return dispatches.shift().then(loadOnServer);
  };

  var clearListeners = function clearListeners() {
    listeners = [];
  };

  var when = whenOnce;
  when.every = whenEvery;
  when.loadOnServer = loadOnServer;
  when.clear = clearListeners;

  return when;
};

//
// predicates
//

var getPathname = function getPathname(location) {
  return location ? '' + location.pathname + location.search : '';
};

var match = exports.match = function match(path) {
  return function (state, prevState) {
    var pathname = getPathname(state.router.location);

    if (prevState) {
      var prevPathname = prevState && getPathname(prevState.router.location);
      return pathname !== prevPathname ? (0, _reactRouterDom.matchPath)(pathname, { path: path }) : false;
    }

    return (0, _reactRouterDom.matchPath)(pathname, { path: path });
  };
};