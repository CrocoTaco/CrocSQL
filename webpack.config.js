const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    // publicPath: '/',
    filename: 'bundle.js'
  },
  mode: 'development',
  devServer: {
    // contentBase: '/dist'
    publicPath: '/dist',
    compress: true,
    port: 8000,
    proxy: {
      '/server/': 'http://localhost:3000'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
};
