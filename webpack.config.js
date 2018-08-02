const webpack = require('webpack');
const path = require('path');

let config = {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: 'commonjs2',
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'source-map';
}

if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      }
    })
  ];
}

module.exports = config;
