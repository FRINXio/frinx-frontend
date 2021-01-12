// @flow weak
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env'),
});

const ENVIRONMENT = process.env.NODE_ENV || 'development';

const isProd = ENVIRONMENT === 'production';
const isDev = ENVIRONMENT === 'development';

if (!(isProd || isDev)) {
  throw new Error('webpack: isProd or isDev has to be true');
}

function fullPath(...parts) {
  return path.join(__dirname, ...parts);
}

const plugins = [
  new HtmlWebPackPlugin({
    template: fullPath('src', 'index.html'),
    inject: true,
    filename: 'index.html',
  }),
  new webpack.DefinePlugin({
    'process.env': Object.keys(dotenv.parsed).reduce(
      (acc, key) => ({
        ...acc,
        [key]: JSON.stringify(dotenv.parsed[key]),
      }),
      {},
    ),
  }),
];

module.exports = {
  entry: [fullPath('src', 'index.ts')],
  output: {
    path: fullPath('build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    inline: true,
    open: false,
    disableHostCheck: true,
    port: 3000,
    contentBase: fullPath('static'),
  },
  devtool: isDev ? 'eval-cheap-module-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss})$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
    ],
  },
  plugins,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  context: fullPath('src'),
};
