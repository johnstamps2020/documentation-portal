module.exports = {
  ignore: ['**/gw.redoc.standalone.js'],
  presets: [
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ],
};
