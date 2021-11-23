const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { PROJECT_PATH } = require('./PATH')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')



module.exports = {
  entry: path.resolve(PROJECT_PATH, './src/index.tsx'),

  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      }, 
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
      }
    ]
  },


  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html'),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(PROJECT_PATH, './src'),
      '@comp': path.resolve(PROJECT_PATH, './src/components'),
      '@utils': path.resolve(PROJECT_PATH, './src/utils'),
      '@view': path.resolve(PROJECT_PATH, './src/view'),
      '@router': path.resolve(PROJECT_PATH, './src/router'),
      '@store': path.resolve(PROJECT_PATH, './src/store'),
    }
  },

}
