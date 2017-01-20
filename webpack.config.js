const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    path: path.resolve('./bundle'),
    filename: 'webglImageDisplacement.js',
    libraryTarget: 'var',
    library: 'ImageDisplacement'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?cacheDirectory'
    },
    {
      test: /\.(svg|png|jpg|webm|mp4|woff|woff2)$/,
      loader: 'file-loader'
    },
    { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
    { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
