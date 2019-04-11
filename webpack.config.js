/* global __dirname, require, module*/

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;
const devMode = env === 'development';
const express = require('express');

let libraryName = process.env.npm_package_name;

let outputFile, mode;

if (devMode) {
  mode = 'development';
  outputFile = libraryName + '.js';
} else {
  mode = 'production';
  outputFile = libraryName + '.[hash:8].min.js';
}

const config = {
  mode: mode,
  entry: __dirname + '/src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'lib'),
    compress: true,
    port: 9000,
    hot: true,
    inline: true,
    before(app, server) {
      app.set('views', __dirname + '/demo');
      app.engine('html', require('ejs').renderFile);
      app.use('/static', express.static(path.join(__dirname, 'demo')));

      app.get('/iframe', (req, res) => {
        res.render('iframe.html');
      });
      app.get('/demo', (req, res) => {
        res.render('index.html');
      });
    },
    after() {
      console.log('\r\n ====> js ready at: http://localhost:9000/usertrack.js');
    }
  },
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
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
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'sass-loader'
        ]
        // use: [ 'style-loader', 'css-loader', 'less-loader' ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
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
      filename: devMode ? `${libraryName}.css` : `${libraryName}.[hash:8].css`,
      chunkFilename: '[id].css'
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/demo/index.html',
      inject: true
    })
  ],
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  }
};

module.exports = config;
