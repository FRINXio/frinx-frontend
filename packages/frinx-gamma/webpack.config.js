/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
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

module.exports = {
  entry: fullPath('src', 'index.ts'),
  output: {
    path: fullPath('dist'),
    filename: 'index.js',
    publicPath: '/',
    library: 'frinxGamma',
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
