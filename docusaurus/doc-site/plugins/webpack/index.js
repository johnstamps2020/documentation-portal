module.exports = function (context, options) {
  return {
    name: 'proxy-webpack-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        mergeStrategy: { 'devServer.proxy': 'replace' },
        devServer: {
          proxy: {
            context: ['/userInformation', '/safeConfig', '/envInformation'],
            target: 'http://localhost:8081',
          },
        },
      };
    },
  };
};
