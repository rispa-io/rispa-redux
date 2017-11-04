const path = require('path')
const { PluginInstance } = require('@rispa/core')
const WebpackPluginApi = require('@rispa/webpack')
const { default: BabelPluginApi } = require('@rispa/babel')
const clientWebpackConfig = require('./configs/client.wpc')

const whenBabelPlugin = path.resolve(__dirname, '../lib/when/babel-plugin.js')

class ReduxPlugin extends PluginInstance {
  constructor(context, config) {
    super(context, config)

    this.webpack = context.get(WebpackPluginApi.pluginName)
    this.babel = context.get(BabelPluginApi.pluginName)
  }

  start() {
    this.babel.addPlugin(whenBabelPlugin)
    this.webpack.addClientConfig(clientWebpackConfig)
  }
}

module.exports = ReduxPlugin
