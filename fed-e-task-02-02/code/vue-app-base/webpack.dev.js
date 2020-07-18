const path = require('path')
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 5000,
    hot: true,
  },
  optimization: {
    usedExports: true,
    minimize: true,
  },
  devtool: 'eval-cheap-module-source-map',
})
