import { LoadContext, Plugin, PluginOptions } from '@docusaurus/types';
import { buildDefault, buildVariants } from './modules/cli';
import { revertFileChanges } from './modules/postBuild';
export { filterSidebarsByAccess } from './modules/filterSidebars';

type PluginContent = {};

export default async function (
  context: LoadContext,
  options: PluginOptions
): Promise<Plugin<PluginContent>> {
  return {
    name: 'docusaurus-security',

    extendCli(cli) {
      cli
        .command('build-variants')
        .description(
          'Build two versions of the site, one with all docs and one with only public docs.'
        )
        .action(async () => {
          if (process.env.BUILD_VARIANTS === 'true') {
            await buildVariants();
          } else {
            await buildDefault();
          }
        });
    },

    async postBuild() {
      revertFileChanges();
    },
  };
}
