var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = function (helper) {
  return {
    devServer: {
      historyApiFallback: true,
      port: 8085,
    },
    performance: {
      hints: false
    },
    devtool: 'eval-source-map',
    // plugins: [
    //   new HtmlWebpackPlugin({
    //     filename: 'index.html',
    //     template: path.resolve(helper.PATHS.dev, 'index.html'),
    //   }),
    // ]
  }
}
