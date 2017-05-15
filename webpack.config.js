const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Conditional builds for dev and prod
let isProd = process.env.NODE_ENV === 'production';

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

// Prepare config for CSS and Sass loaders depending on dev/prod environment
// ExtractTextPlugin doesn't work with HMR, so disable it on development

// CSS build config
let cssDev = ['style-loader', 'css-loader', postCSSloader];
let cssProd = ExtractTextPlugin.extract({
   fallback: 'style-loader',
   use: ['css-loader', postCSSloader],
   publicPath: '/dist'
});

let cssConfig = isProd ? cssProd : cssDev;

// Sass build config
let sassDev = ['style-loader', 'css-loader', 'sass-loader', postCSSloader];
let sassProd = ExtractTextPlugin.extract({
   fallback: 'style-loader',
   use: ['css-loader', 'sass-loader', postCSSloader],
   publicPath: '/dist'
});

let sassConfig = isProd ? sassProd : sassDev;

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
         test: /\.js$/,
         exclude: /(node_modules|bower_components)/,
         use: ['babel-loader']
      }, {
         test: /\.css$/,
         use: cssConfig
      }, {
         test: /\.scss$/,
         use: sassConfig
      }, {
         test: /\.(jpe?g|png|gif|svg)$/i,
         use: [
            'file-loader?name=[name].[ext]&publicPath=images/&outputPath=images/',
            'image-webpack-loader'
         ]
      }]
   },

   devServer: {
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      port: 8080,
      hot: true,
      stats: 'minimal',
      open: true
   },

   plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new ExtractTextPlugin({
         filename: 'app.css',
         disable: !isProd,
         allChunks: true
      })
   ]
};