/* global __dirname, require, module*/

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const env = process.env.NODE_ENV;
const devMode = env === 'development';
const express = require('express');

let libraryName = process.env.npm_package_name;
const version = process.env.npm_package_version;

let outputFile, mode;
const plugins = [
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: devMode ? `${libraryName}.css` : `${libraryName}.v${version}.css`,
    chunkFilename: '[id].css'
  }),
  // https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: __dirname + '/demo/index.html',
    inject: true
  })
];
if (devMode) {
  mode = 'development';
  outputFile = libraryName + '.js';
  plugins.push(new BundleAnalyzerPlugin({
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
  }));
} else {
  mode = 'production';
  outputFile = `${libraryName}.v${version}.min.js`;
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
    allowedHosts: [
      '.ms.com'
    ],
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
        test: /\.less$/,
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
        use: [
          { loader: 'file-loader?name=/public/icons/[name].[ext]' }
        ]
      }
    ]
  },
  plugins,
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/')
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
