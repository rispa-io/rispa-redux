const WebpackPluginApi = require('@rispa/webpack')
const { default: BabelPluginApi } = require('@rispa/babel')
const ReduxPlugin = require('./ReduxPlugin')

module.exports.default = ReduxPlugin

module.exports.after = [WebpackPluginApi.pluginName, BabelPluginApi.pluginName]
