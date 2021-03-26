// @flow weak
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: isDev ? path.resolve(__dirname, 'src/index-dev.js') : path.resolve(__dirname, 'src/index.js'),
  devServer: {
    historyApiFallback: true,
    inline: true,
    hot: true,
    open: false,
    disableHostCheck: true,
    port: 3000,
    proxy: {
      '/api/conductor': {
        target: 'http://localhost:3001',
        secure: false,
      },
      // Uncomment below settings when testing frinx-workflow-ui running on host and talking to workflow-proxy in net-auto
      /*
            '/': {
              target: 'http://localhost:5000',
              secure: false,
            }
            */
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'frinxWorkflowUI',
    libraryTarget: 'umd',
    publicPath: '/',
    // Substitute publicPath above with settings below when testing frinx-workflow-ui running on host and talking to workflow-proxy in net-auto
    /*
        publicPath: '/workflow/frontend/',
        */
  },
  devtool: isDev ? 'source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.(css|scss})$/,
        loader: 'style-loader!css-loader!sass-loader',
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
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  externals: isDev
    ? undefined
    : [
        {
          react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
            umd: 'react',
          },
          'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
            umd: 'react-dom',
          },
          'react-router-dom': {
            root: 'ReactRouterDOM',
            commonjs2: 'react-router-dom',
            commonjs: 'react-router-dom',
            amd: 'react-router-dom',
            umd: 'react-router-dom',
          },
          'framer-motion': {
            root: 'FramerMotion',
            commonjs2: 'framer-motion',
            commonjs: 'framer-motion',
            amd: 'framer-motion',
            umd: 'framer-motion',
          },
        },
        /@chakra-ui\/react\/.*/,
        /@chakra-ui\/icons\/.*/,
        /@emotion\/react\/.*/,
        /@emotion\/styled\/.*/,
      ],
};
