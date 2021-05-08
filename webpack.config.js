const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  context: path.join(__dirname, './src'),
  entry: './js/main.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './dist')
  },
  devServer: {
    contentBase: './',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new Visualizer(),
  ],
  mode: 'production'
};
