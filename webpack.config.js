const webpack = require('webpack');

const MINIFY = JSON.parse(process.env.MINIFY_ENV || '0');

module.exports = {
  entry: './lib/tinymce-prism.js',

  output: {
    path: './',
    filename: MINIFY ? 'plugin.min.js' : 'plugin.js'
  },

  plugins: MINIFY ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : [],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ],
  },
  
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
};
