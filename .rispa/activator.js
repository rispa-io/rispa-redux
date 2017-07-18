import { init, build } from '@rispa/core/events'
import { server } from '@rispa/server/events'
import getBabelOptions from './babel-options'
import webpackClientConfig from './client.wpc'

const activator = on => {
  const initHandler = registry => {
    registry.add('webpack.client', webpackClientConfig)
    registry.add('babel', getBabelOptions)
  }

  on(init(build), initHandler)
  on(init(server), initHandler)
}

export default activator
