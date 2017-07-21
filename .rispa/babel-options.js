import path from 'path'

export default () => ({
  plugins: [
    path.resolve(__dirname, '../src/when/babel-plugin.js'),
  ],
})
