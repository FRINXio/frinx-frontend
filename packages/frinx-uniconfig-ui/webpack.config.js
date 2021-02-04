// @flow weak
const path = require('path');
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
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'frinxUniConfigUI',
    libraryTarget: 'umd',
    publicPath: '/',
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
  ],
  externals: isDev
    ? undefined
    : {
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
      },
};
