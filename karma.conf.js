var webpack = require('webpack');

module.exports = function (config) {
  config.set({

    // logLevel: 'LOG_DEBUG',

    browsers: ['Chrome'],

    // when restartOnFileChange is true no tests are run on
    // on change. Karma runs 0 tests..
    // restartOnFileChange: true,

    frameworks: ['mocha', 'sinon', 'expect'],

    files: [
      'webpack.tests.js'
    ],

    preprocessors: {
      'webpack.tests.js': ['webpack', 'sourcemap']
    },

    reporters: ['dots', 'coverage'],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [{
          test: /\.js$/,
          include: /src/,
          exclude: /node_modules/,
          loader: 'isparta'
        }],
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['es2015', 'stage-0']
            }
          },
          {
            test: /\.json$/,
            loader: 'json'
          }
        ]
      },
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
          presets: ['es2015', 'stage-0'],
          plugins: ['rewire']
        }
      },
      node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    },

    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        { type: 'html', dir: 'coverage' }
      ]
    },

    webpackServer: {
      noInfo: true
    }

  });
};
