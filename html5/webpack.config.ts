import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Configuration, DefinePlugin, PathData } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

const isOffline = process.env.BUILD_MODE === 'offline';

const offlineBuildPath = resolve(__dirname, 'build');
const onlineBuildPath = resolve(__dirname, 'static', 'html5', 'scripts');

function getBuildPath() {
  if (isOffline) {
    return offlineBuildPath;
  }

  return onlineBuildPath;
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

const baseEntries = {
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
};

const analyticsEntries = {
  analyticsInstall: {
    import: './src/analyticsInstall.js',
    filename: 'analyticsInstall.js',
  },
  analyticsInitialize: {
    import: './src/analyticsInitialize.js',
    filename: 'analyticsInitialize.js',
  },
};

const config: Configuration = {
  stats: {
    errorDetails: true,
  },
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: isOffline ? baseEntries : { ...baseEntries, ...analyticsEntries },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : undefined,
  watchOptions: {
    followSymlinks: true,
    ignored: ['**/dist/**', `${offlineBuildPath}/**`, `${onlineBuildPath}/**`],
  },
  plugins: [
    new CompressionPlugin(),
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: false,
    }),
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
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
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
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: require.resolve('./tsconfig.json'),
              },
            },
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
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader', postCss],
            exclude: /\.module\.css$/,
          },
        ],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
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
