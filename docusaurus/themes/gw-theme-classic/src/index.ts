import type { LoadContext, Plugin } from '@docusaurus/types';
import type { PluginOptions } from '@docusaurus/theme-classic';
import type { ThemeConfig } from '@docusaurus/theme-common';
import { resolve } from 'path';
import { PluginData } from '@theme/Types';
import { PLUGIN_NAME } from './types/constants';
import type { TranslationFileContent } from '@docusaurus/types';
import { readFileSync } from 'fs';

export function readJsonFile(fileName: string): { [id: string]: string } {
  const translationData: TranslationFileContent = JSON.parse(
    readFileSync(`${__dirname}/i18n/${fileName}`, { encoding: 'utf-8' })
  );

  return Object.entries(translationData).reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [key]: value.message,
    }),
    {}
  );
}

const getAppBaseUrl = () => {
  if (process.env['TARGET_URL']) {
    if (!process.env['TARGET_URL'].match('.staging.')) {
      return process.env['TARGET_URL'];
    }
  }

  return 'https://docs.guidewire.com';
};

const siteMetadata = {
  gwDocId: process.env['GW_DOC_ID'] || 'exampleid',
  appBaseUrl: getAppBaseUrl(),
};

export default async function (
  context: LoadContext,
  options: PluginOptions
): Promise<Plugin<undefined>> {
  const {
    i18n: { currentLocale },
  } = context;

  const themeConfig = context.siteConfig.themeConfig as ThemeConfig;
  if (themeConfig?.colorMode) {
    themeConfig.colorMode.disableSwitch = true;
  }

  return {
    name: PLUGIN_NAME,

    getThemePath() {
      return resolve(__dirname, '../lib/theme');
    },

    getTypeScriptThemePath() {
      return resolve(__dirname, '../src/theme');
    },

    async getDefaultCodeTranslationMessages() {
      return readJsonFile(`${context.i18n.currentLocale}.json`);
    },

    async contentLoaded({ actions, allContent }) {
      const defaultContent: any =
        allContent['docusaurus-plugin-content-docs'].default;
      const topVersionContent = defaultContent.loadedVersions[0];

      // get internal docs
      const docs = topVersionContent.docs;
      const internalDocIds = docs
        .map((d) => d.frontMatter.internal && d.unversionedId)
        .filter(Boolean);

      const pluginData: PluginData = {
        internalDocIds,
        ...siteMetadata,
      };
      const { setGlobalData } = actions;
      setGlobalData(pluginData);
    },
  };
}
