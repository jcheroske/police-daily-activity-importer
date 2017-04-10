const { resolve } = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const PROD = process.env.NODE_ENV === 'production'

module.exports = {
  context: __dirname,
  devtool: PROD ? 'nosources-source-map' : 'source-map',
  entry: './src/index.js',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: resolve(__dirname, './dist')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),

    ...(PROD ? [new UglifyJSPlugin({
      compressor: {
        unsafe: true
      }
    })] : [])
  ],
  resolve: {
    extensions: ['.js'],
    modules: ['lib', 'node_modules']
  },
  target: 'node'
}
