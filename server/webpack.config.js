const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    html5help: {
      import: './public/scripts/html5template.js',
      filename: 'html5.js',
    },
    html5Home: {
      import: './src/html5home/html5homeTemplate.js',
      filename: 'html5home.js',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'html5.css',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'static', 'html5', 'scripts'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: [/node_modules/, /static/, /out/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-react']],
          },
        },
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
