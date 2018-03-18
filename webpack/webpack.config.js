const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfigCommon = require('./webpack.config.common.js');
const webpackConfigDev = require('./webpack.config.dev.js');
const webpackConfigProd = require('./webpack.config.prod.js');



let helper = {
  PATHS: {
    root: path.join(__dirname, '../'),
    src: path.join(__dirname, '../src'),
    dev: path.join(__dirname, '../dev'),
    node_modules: path.join(__dirname, '../node_modules'),
    dist: path.join(__dirname, '../dist'),
    publicPath: '',
    outputPath: ''
  },
  TARGET: process.env.npm_lifecycle_event
}


let PREBUILD_CFG_PROD = {
  plugins: [
    new CleanPlugin([helper.PATHS.dist], {
      root: helper.PATHS.root,
      dry: false,
      verbose: true,
    })
  ]
}

let PREBUILD_CFG_DEV = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: helper.PATHS.dev + '/index.html',
        to: path.join(helper.PATHS.dist)
      },
      {
        from: helper.PATHS.dev + '/polyfills',
        to: path.join(helper.PATHS.dist, 'polyfills', helper.PATHS.outputPath),
        toType: 'dir'
      }
    ])
  ]
}


if (process.env.NODE_ENV === 'production') {
  module.exports = [merge(PREBUILD_CFG_PROD, webpackConfigCommon(helper), webpackConfigProd(helper))];
} else {
  module.exports = [merge(PREBUILD_CFG_DEV, webpackConfigCommon(helper), webpackConfigDev(helper))];
}
