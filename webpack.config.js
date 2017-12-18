const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Conditional builds for dev and prod
const isProd = process.env.NODE_ENV === 'production';

// PostCSS loader settings
const postCSSloader = {
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
const cssDev = ['style-loader', 'css-loader', postCSSloader];
const cssProd = ExtractTextPlugin.extract({
   fallback: 'style-loader',
   use: ['css-loader', postCSSloader],
   publicPath: '../'
});

const cssConfig = isProd ? cssProd : cssDev;

// Sass build config
const sassDev = ['style-loader', 'css-loader', postCSSloader, 'sass-loader'];
const sassProd = ExtractTextPlugin.extract({
   fallback: 'style-loader',
   use: ['css-loader', postCSSloader, 'sass-loader'],
   publicPath: '../'
});

const sassConfig = isProd ? sassProd : sassDev;

module.exports = {
   entry: {
      index: './src/index.js',
      pageA: './src/js/pagea.js',
      pageB: './src/js/pageb.js',
      admin: './src/js/admin.js'
   },

   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].bundle.js'
   },

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
         },
         {
            test: /\.css$/,
            use: cssConfig
         },
         {
            test: /\.scss$/,
            use: sassConfig
         },
         {
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /fonts?/,
            use: [
               'file-loader?name=[name].[ext]&outputPath=images/',
               'image-webpack-loader'
            ]
         },
         {
            test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            exclude: /(images?|img)/,
            use: 'file-loader?name=fonts/[name].[ext]'
         }
      ]
   },

   devServer: {
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      port: 7000,
      hot: true,
      stats: 'minimal',
      open: true
   },

   plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
         name: 'vendor',
         minChunks: 2
      }),
      new HtmlWebpackPlugin({
         title: 'Webpack Starter',
         minify: {
            collapseWhitespace: true
         },
         hash: true,
         template: './src/index.ejs', // Load a custom template (ejs by default see the FAQ for details)
      }),
      new ExtractTextPlugin({
         filename: 'css/[name].css',
         disable: !isProd,
         allChunks: true
      }),
      new BundleAnalyzerPlugin()
   ]
};