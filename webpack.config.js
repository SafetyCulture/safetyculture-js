'use strict';

var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  externals: {
    'fs': true,
    'net': true,
    'tls': true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      { test: /\.json$/, loaders: ['json'] }
    ]
  },
  // output: {
  //   library: 'safetyculture',
  //   libraryTarget: 'umd'
  // },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        unused: true,
        dead_code: true
      },
      sourceMap: true // if true, uses SourceMaps to map error message locations to modules.
                       // This slows down the compilation
    })
  ]
};
