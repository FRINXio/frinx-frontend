// @flow weak
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: isDev ? path.resolve(__dirname, 'src/index.ts') : path.resolve(__dirname, 'src/index.ts'),
  devServer: {
    historyApiFallback: true,
    inline: true,
    hot: true,
    open: false,
    disableHostCheck: true,
    port: 3000,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', ".jsx" ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  devtool: isDev ? 'source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss})$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(jpe?g|gif|png|svg|)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: 'url-loader',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_URL_UNICONFIG': JSON.stringify('false'),
      'process.env.REACT_APP_URL_UNICONFIG_ENABLED': JSON.stringify('false'),
      'process.env.REACT_APP_URL_UNIFLOW': JSON.stringify('false'),
      'process.env.REACT_APP_URL_INVENTORY': JSON.stringify('false'),
      'process.env.REACT_APP_URL_USER_MGMT': JSON.stringify('false'),
      'process.env.REACT_APP_URL_UNIFLOW_ENABLED': JSON.stringify('false'),
      'process.env.REACT_APP_URL_INVENTORY_ENABLED': JSON.stringify('false'),
      'process.env.REACT_APP_URL_USER_MGMT_ENABLED': JSON.stringify('false'),
      'process.env.REACT_APP_AUTH_ENABLED': JSON.stringify('false'),
      'process.env.REACT_APP_AD_CLIENT_ID': JSON.stringify(''),
      'process.env.REACT_APP_AD_REDIRECT_URL': JSON.stringify(''),
      'process.env.PUBLIC_URL': JSON.stringify('/'),
    }),
  ],
};
