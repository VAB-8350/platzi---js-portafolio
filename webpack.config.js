const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssEctractorPlugin = require('mini-css-extract-plugin')
const copyPlugin = require('copy-webpack-plugin');
const cssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const terserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]',
  },
  resolve: {
    extensions: ['.js', ],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@templates': path.resolve(__dirname, 'src/templates'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css|.styl$/i,
        use: [miniCssEctractorPlugin.loader,
        'css-loader', 
        'stylus-loader'
        ],
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: '[name].[contenthash].[ext]',
            outputPath: './assets/fonts/',
            publicPath: '../assets/fonts/',
            esModule: false,
          }
        }
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      inject: true,
      template:'./public/index.html',
      filename: './index.html'
    }),
    new miniCssEctractorPlugin({
      filename: 'assets/[name].[contenthash].css',
    }),
    new copyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets/images'),
          to: 'assets/images'
        }
      ]
    }),
    new dotenv(),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new cssMinimizerPlugin(),
      new terserPlugin(),
    ]
  }
}