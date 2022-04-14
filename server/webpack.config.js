const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const postCss = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        [
          'postcss-preset-env',
          {
            // Options
          },
        ],
      ],
    },
  },
};

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
    html5Skip: {
      import: './src/html5home/html5skipTemplate.js',
      filename: 'html5skip.js',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: pathData => {
        if (pathData.chunk.filenameTemplate === 'html5home.js') {
          return 'html5home.css';
        }
        if (pathData.chunk.filenameTemplate === 'html5skip.js') {
          return 'html5skip.css';
        }
        return 'html5.css';
      },
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'static', 'html5', 'scripts'),
    publicPath: '',
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
            plugins: [
              [
                'prismjs',
                {
                  languages: [
                    'apacheconf',
                    'bash',
                    'batch',
                    'clike',
                    'css',
                    'csv',
                    'docker',
                    'dockerfile',
                    'gherkin',
                    'git',
                    'html',
                    'java',
                    'javastacktrace',
                    'js',
                    'json',
                    'json5',
                    'jsonp',
                    'kotlin',
                    'markdown',
                    'plsql',
                    'powershell',
                    'python',
                    'jsx',
                    'tsx',
                    'sass',
                    'scss',
                    'sql',
                    'ts',
                    'typescript',
                    'uri',
                    'url',
                    'xml',
                    'yml',
                  ],
                  plugins: [
                    'line-numbers',
                    'keep-markup',
                    'toolbar',
                    'show-language',
                    'copy-to-clipboard',
                    'match-braces',
                  ],
                  theme: 'tomorrow',
                  css: true,
                },
              ],
            ],
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
              modules: {
                mode: 'local',
                auto: true,
                exportGlobals: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          postCss,
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', postCss],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
