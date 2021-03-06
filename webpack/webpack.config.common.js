const path = require('path');
const webpack = require('webpack');



module.exports = function(helper) {
  return {
    mode: process.env.NODE_ENV,
    entry: {
      'index': path.resolve(helper.PATHS.src, 'main.ts'),
    },
    output: {
      path: helper.PATHS.dist,
      publicPath: '/',
      filename: '[name].js',
    },
    module: {
      rules: [{
          test: /\.ts$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                babelrc: process.env.NODE_ENV === 'production'
              }
            },
            {
              loader: "ts-loader"
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [helper.PATHS.node_modules]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '[folder]/[name].[ext]?[hash]'
          }
        },
        {
          test: /\.(eot|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
          use: 'file-loader?name=[folder]/[name].[ext]',
        },
        {
          test: /\.scss$/,
          use: [{
              loader: "raw-loader"
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: "sass-loader"
            }
          ],
          include: [path.join(helper.PATHS.src, 'components')]
        },
        {
          test: /\.css$/,
          use: [{
            loader: 'raw-loader'
          }, ],
          include: [path.join(helper.PATHS.src, 'components')]
        },
      ]
    },
    resolve: {
      modules: [helper.PATHS.src, helper.PATHS.node_modules],
      extensions: ['.ts', '.js', '.json']
    }
  }
}