const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const atImport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const reporter = require('postcss-reporter')

module.exports = {
  entry: [
    './index.js',
    './index.css'
  ],
  output: {
    path: path.resolve('./bundle'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?cacheDirectory'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap&-autoprefixer&importLoaders=1!postcss')
    },
    {
      test: /\.(svg|png|jpg|webm|mp4|woff|woff2)$/,
      loader: 'file-loader'
    },
    { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
    { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }]
  },
  postcss: function (webpack) {
    return [
      atImport({addDependencyTo: webpack}),
      cssnext,
      reporter({clearMessages: true})
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin()
  ]
}
