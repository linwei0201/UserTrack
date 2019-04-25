/* global __dirname, require, module*/

const path = require('path');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const express = require('express');
const webpackConfigBase = require('./webpack.base.config');

let libraryName = process.env.npm_package_name;

const webpackConfigDev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../lib'),
    compress: true,
    port: 9000,
    hot: true,
    inline: true,
    allowedHosts: [
      '.ms.com'
    ],
    before(app, server) {
      app.set('views', path.join(__dirname, '../demo'));
      app.engine('html', require('ejs').renderFile);
      app.use('/static', express.static(path.join(__dirname, '../demo')));

      app.get('/iframe', (req, res) => {
        res.render('iframe.html');
      });
      app.get('/demo', (req, res) => {
        res.render('index.html');
      });
      app.get('/demo2', (req, res) => {
        res.render('index-old.html');
      });

      app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
        );
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        if (req.method === 'OPTIONS') {
          res.send(200);
        } else {
          next();
        }
      });
    },
    after() {
      console.log('\r\n ====> demo ready at: http://127.0.0.1:9000/demo');
      console.log('\r\n ====> js ready at: http://127.0.0.1:9000/usertrack.js');
      console.log('\r\n ====> bundle analyzer at: http://127.0.0.1:8888');
    }
  },
  output: {
    filename: libraryName + '.js'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    })
  ]
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
