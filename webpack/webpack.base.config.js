/* eslint-disable */
/* global __dirname, require, module*/

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const env = process.env.NODE_ENV;
const devMode = env === 'development';

let libraryName = process.env.npm_package_name;
const version = process.env.npm_package_version;

const config = {
  entry: path.join(__dirname, '../src/index.js'),
  output: {
    path: path.join(__dirname, '../lib'),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'less-loader'
        ]
        // use: [ 'style-loader', 'css-loader', 'less-loader' ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /node_modules/,
        use: [
          { loader: 'file-loader?name=/public/icons/[name].[ext]' }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? `${libraryName}.css` : `${libraryName}.v${version}.css`,
      chunkFilename: '[id].css'
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../demo/index.html'),
      inject: true
    })
  ],
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('../src')],
    extensions: ['.json', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src/')
    }
  },
  optimization: {
    minimizer: [new OptimizeCssPlugin({})]
  },
  externals: {
    jquery: 'jQuery'
  }
};

module.exports = config;
