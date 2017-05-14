const path = require('path');
const webpack = require('webpack');

module.exports = {
   entry: {
      main: './src/js/index.js'
   },

   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
   },

   devServer: {
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      port: 8080,
      stats: 'minimal',
      open: true
   },
};