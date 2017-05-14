const path = require('path');
const webpack = require('webpack');

// PostCSS loader settings
let postCSSloader = {
   loader: 'postcss-loader',
   options: {
      plugins: (loader) => [
         require('autoprefixer')({
            browsers: [
               '> 2%',
               'last 3 versions',
            ]
         }),
         require('cssnano')()
      ]
   }
};

module.exports = {
   entry: {
      main: './src/js/index.js'
   },

   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
   },

   module: {
      rules: [{
         test: /\.css$/,
         use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            postCSSloader
         ]
      }, {
         test: /\.scss$/,
         use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
            postCSSloader
         ]
      }]
   },

   devServer: {
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      port: 8080,
      stats: 'minimal',
      open: true
   },
};