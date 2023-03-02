import { resolve } from 'path';

const buildPages = require(resolve(__dirname, 'scripts/buildPages')).buildPages;

module.exports = function (context, options) {
  return {
    name: 'gw-plugin-redoc',
    extendCli(cli) {
      cli
        .command('redoc-generate-pages')
        .description('Generate redoc pages using the specs and config')
        .action(async () => {
          await buildPages(options);
        });
    },
    getThemePath() {
      return resolve(__dirname, './theme');
    },
  };
};
