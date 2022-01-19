const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './public/scripts/html5template.js',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'html5.css',
    }),
  ],
  output: {
    filename: 'html5.js',
    path: path.resolve(__dirname, 'static', 'html5', 'scripts'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
