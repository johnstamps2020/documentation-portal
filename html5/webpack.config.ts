import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { PathData, DefinePlugin, Configuration } from 'webpack';

const isOffline = process.env.BUILD_MODE === 'offline';

function getBuildPath() {
  if (isOffline) {
    return resolve(__dirname, 'build');
  }

  return resolve(__dirname, 'static', 'html5', 'scripts');
}

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

const config: Configuration = {
  mode: 'production',
  entry: {
    html5help: {
      import: './src/html5help/html5.ts',
      filename: 'html5.js',
    },
    html5Home: {
      import: './src/html5home/html5home.ts',
      filename: 'html5home.js',
    },
    html5Skip: {
      import: './src/html5home/html5skip.ts',
      filename: 'html5skip.js',
    },
  },
  devtool: 'inline-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData: PathData) => {
        if (pathData.chunk?.name === 'html5Home') {
          return 'html5home.css';
        }
        if (pathData.chunk?.name === 'html5Skip') {
          return 'html5skip.css';
        }
        if (pathData.chunk?.name === 'html5help') {
          return 'html5.css';
        }
        return `${pathData.chunk?.id}.css`;
      },
    }),
    new DefinePlugin({
      BUILD_MODE: `"${process.env.BUILD_MODE}"` || 'online',
    }),
  ],
  output: {
    path: getBuildPath(),
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: [/node_modules/, /static/, /out/, /build/],
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@theme': resolve(
        __dirname,
        '..',
        'node_modules',
        '@doctools',
        'gw-theme-classic',
        'lib',
        'theme'
      ),
    },
  },
};

export default config;
