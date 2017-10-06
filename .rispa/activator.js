const WebpackPluginApi = require('@rispa/webpack')
const { default: BabelPluginApi } = require('@rispa/babel')
const ReduxPlugin = require('../src/ReduxPlugin')

function init(context, config) {
  return new ReduxPlugin(context, config)
}

const after = [WebpackPluginApi.pluginName, BabelPluginApi.pluginName]

module.exports = init

module.exports.after = after
