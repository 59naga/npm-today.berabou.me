import webpack from 'webpack';
import path from 'path';

const filename = 'bundle.min.js';
const config = {
  entry: './src/client/index.js',
  output: {
    filename,
    path: path.join(__dirname, 'public'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.styl$/,
        loader: 'style!css?sourceMap!stylus',
      },
    ],
  },

  devServer: {
    filename,
    port: 59798,
    quiet: true,
    contentBase: 'public',

    // see https://webpack.github.io/docs/webpack-dev-server.html#api
    historyApiFallback: true,
  },
};

switch (process.env.npm_lifecycle_event) {
  case 'build:client':
    process.env.NODE_ENV = 'production';
    config.plugins = [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    ];
    break;

  default:
    config.devtool = '#source-map';

}

export default config;
