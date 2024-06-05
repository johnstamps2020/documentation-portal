const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@doctools/components': path.resolve(__dirname, '../components/dist'),
    '@doctools/server': path.resolve(__dirname, '../server/dist'),
  })
);
