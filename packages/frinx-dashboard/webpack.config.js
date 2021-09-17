/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* eslint-enable */

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
  new CopyWebpackPlugin({
    patterns: [
      { from: fullPath('static'), to: '.' },
      { from: fullPath('config'), to: '.' },
    ],
  }),
  new HtmlWebPackPlugin({
    template: isDev ? fullPath('src', 'index.dev.html') : fullPath('src', 'index.shtml'),
    inject: false,
    filename: isDev ? 'index.html' : 'index.shtml',
    scriptLoading: 'blocking',
  }),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/,
  }),
  new webpack.DefinePlugin({
    COMMIT_HASH: JSON.stringify(process.env.COMMIT_HASH),
  }),
];

module.exports = {
  entry: [fullPath('src', 'index.ts')],
  output: {
    path: fullPath('build'),
    filename: 'static/bundle.js',
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
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-flow'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        include: [/frinx-workflow-ui/, /frinx-uniconfig-ui/, /frinx-uniresource-ui/],
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
      {
        test: /\.inline.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
    ],
  },
  plugins,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  context: fullPath('src'),
};
