import { resolve } from 'path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { BuildPagesProps } from './scripts/buildPages';
import { GuidewireRedocPluginProps } from './scripts/buildPages';

const buildPages = require(resolve(__dirname, 'scripts/buildPages')).buildPages;

export type PluginConfig = GuidewireRedocPluginProps;

export default async function (
  context: LoadContext,
  options: BuildPagesProps
): Promise<Plugin<undefined>> {
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
}
