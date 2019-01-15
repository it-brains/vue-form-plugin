const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'source-map';
}

if (process.env.NODE_ENV === 'production') {
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          warnings: false,
          output: null,
        },
      })
    ],
  };
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
