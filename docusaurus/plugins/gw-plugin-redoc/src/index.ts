import { resolve } from 'path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import {
  buildPages,
  BuildPagesProps,
  GuidewireRedocPluginProps,
} from './scripts/buildPages';

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
