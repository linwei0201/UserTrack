/* global __dirname, require, module*/
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');

let libraryName = process.env.npm_package_name;
const version = process.env.npm_package_version;

const webpackConfigProd = {
  mode: 'production',
  output: {
    filename: `${libraryName}.v${version}.min.js`
  }
};

module.exports = merge(webpackConfigBase, webpackConfigProd);
