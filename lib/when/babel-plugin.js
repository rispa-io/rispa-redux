'use strict';

var md5 = require('md5');

var ENV = process.env.BABEL_ENV || process.env.NODE_ENV;

var hash = ENV === 'production' ? function (filename) {
  return md5(filename);
} : function (filename) {
  return filename;
};

module.exports = function (_ref) {
  var t = _ref.types;
  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        var isWhen = path.node.callee.name === 'when';
        var isWhenEvery = t.isMemberExpression(path.node.callee) && path.node.callee.object.name === 'when' && path.node.callee.property.name === 'every';

        if ((isWhen || isWhenEvery) && path.node.arguments.length === 2 && t.isCallExpression(path.node.arguments[0]) && path.node.arguments[0].callee.name === 'match') {
          var key = hash(state.file.opts.filename);
          path.node.arguments.push(t.stringLiteral(key));
        }
      }
    }
  };
};