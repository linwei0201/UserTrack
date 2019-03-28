/* global __dirname, require, module*/

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV;
const devMode = env === 'development';

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
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? `${libraryName}.css` : `${libraryName}.[hash:8].css`,
      chunkFilename: '[id].css'
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
