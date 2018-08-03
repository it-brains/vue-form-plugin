const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  },
  plugins: [],
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'source-map';
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      }
    })
  );
}

if (process.env.NODE_ENV === 'server') {
  config.entry = './demos/dev/src/index.js';
  config.output.path = path.resolve(__dirname, "demos/dev/dist");
  config.output.libraryTarget = 'umd';

  config.devtool = 'source-map';
  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './demos/template.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
  );
}

module.exports = config;
