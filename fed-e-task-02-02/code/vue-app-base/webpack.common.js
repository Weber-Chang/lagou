const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      components: './src/components/'
    },
    extensions: ['.js', '.json', '.css', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
            esModule: false,
          },
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Yue-Webpack',
      template: './public/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({ // 这个是用来配置全局变量
      URL: '"http://127.0.0.1:5000"'
    })
  ],
}
