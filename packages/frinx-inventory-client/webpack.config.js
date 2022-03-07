/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
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
  new HtmlWebPackPlugin({
    template: fullPath('src', 'index.html'),
    inject: true,
    filename: 'index.html',
  }),
];

module.exports = {
  entry: isDev ? fullPath('src/index-dev.ts') : fullPath('src', 'index.ts'),
  output: {
    path: fullPath('dist'),
    filename: 'index.js',
    publicPath: '/',
    library: 'frinxWorkflowBuilder',
    libraryTarget: 'umd',
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
  externals: isDev
    ? undefined
    : {
        react: 'react',
        reactDOM: 'react-dom',
      },
};
