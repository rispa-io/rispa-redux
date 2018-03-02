const md5 = require('md5')

const ENV = process.env.BABEL_ENV || process.env.NODE_ENV

const hash = ENV === 'production'
  ? filename => md5(filename)
  : filename => filename

module.exports = ({ types }) => ({
  visitor: {
    CallExpression(path, state) {
      const isWhen = path.node.callee.name === 'when'
      const isWhenEvery = (
        types.isMemberExpression(path.node.callee) &&
        path.node.callee.object.name === 'when' &&
        path.node.callee.property.name === 'every'
      )

      if (
        (isWhen || isWhenEvery) &&
        path.node.arguments.length === 2 &&
        types.isCallExpression(path.node.arguments[0]) &&
        path.node.arguments[0].callee.name === 'match'
      ) {
        const key = hash(state.file.opts.filename)
        path.node.arguments.push(types.stringLiteral(key))
      }
    },
  },
})
