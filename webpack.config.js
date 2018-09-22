module.exports = {
  output: {
    path: __dirname + '/',
    publicPath: '/',
    filename: 'build.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};