const { group, env } = require('@webpack-blocks/webpack2')

const resolve = require.resolve

module.exports = group([
  env('development', [
    () => ({
      entry: {
        vendor: [
          resolve('redux'),
          resolve('react-redux'),
          resolve('redux-act'),
          resolve('redux-form'),
          resolve('react-router-redux'),
          resolve('redux-logger'),
          resolve('@csssr/redux-loop'),
        ],
      },
      resolve: {
        alias: {
          'redux-form$': resolve('redux-form'),
          'react-router-redux$': resolve('react-router-redux'),
          'redux-logger$': resolve('redux-logger'),
        },
      },
    }),
  ]),
  env('production', [
    () => ({
      entry: {
        vendor: [
          resolve('redux/dist/redux.min.js'),
          resolve('react-redux/dist/react-redux.min.js'),
          resolve('redux-act/dist/redux-act.min.js'),
          resolve('redux-form/dist/redux-form.min.js'),
          resolve('react-router-redux/umd/react-router-redux.min.js'),
          resolve('@csssr/redux-loop'),
        ],
      },
      resolve: {
        alias: {
          redux$: resolve('redux/dist/redux.min.js'),
          'react-redux$': resolve('react-redux/dist/react-redux.min.js'),
          'redux-act$': resolve('redux-act/dist/redux-act.min.js'),
          'redux-form$': resolve('redux-form/dist/redux-form.min.js'),
          'react-router-redux$': resolve('react-router-redux/umd/react-router-redux.min.js'),
        },
      },
    }),
  ]),
])
