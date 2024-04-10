import type { PluginOptions } from '@docusaurus/theme-classic';
import type { ThemeConfig } from '@docusaurus/theme-common';
import type {
  LoadContext,
  Plugin,
  TranslationFileContent,
} from '@docusaurus/types';
import { readFileSync, readdirSync, statSync } from 'fs';
import { extname, relative, resolve } from 'path';
import { PluginData } from './types';
import { PLUGIN_NAME } from './types/constants';
const matter = require('gray-matter');

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
  gwDocId: process.env['GW_DOC_ID'] || 'exampleId',
  appBaseUrl: getAppBaseUrl(),
};

type PluginContent = {
  internalDocIds: string[];
};

function getAllFilesRecursively(rootDir: string): string[] {
  const filesAndFolders = readdirSync(rootDir);
  return filesAndFolders
    .map((fileOrFolder) => {
      const absolutePath = resolve(rootDir, fileOrFolder);
      if (statSync(absolutePath).isDirectory()) {
        return getAllFilesRecursively(absolutePath);
      }

      return absolutePath;
    })
    .flat();
}

function getInternalDocIds(docsDir: string): PluginContent['internalDocIds'] {
  const allDocFiles = getAllFilesRecursively(docsDir).filter((filePath) =>
    ['.md', '.mdx'].includes(extname(filePath))
  );

  const internalDocIds = [];
  for (const docFilePath of allDocFiles) {
    const fileContents = readFileSync(docFilePath, 'utf-8');
    const frontMatter = matter(fileContents).data;
    if (!frontMatter) {
      continue;
    }

    const isInternal = frontMatter.internal === true;
    if (isInternal) {
      const removeExtensionRegExp = new RegExp(`${extname(docFilePath)}$`);
      const docId =
        frontMatter.id ||
        relative(docsDir, docFilePath).replace(removeExtensionRegExp, '');
      internalDocIds.push(docId);
    }
  }

  return internalDocIds;
}

export default async function (
  context: LoadContext,
  options: PluginOptions
): Promise<Plugin<PluginContent>> {
  const {
    i18n: { currentLocale },
  } = context;

  const themeConfig = context.siteConfig.themeConfig as ThemeConfig;
  if (themeConfig?.colorMode) {
    (themeConfig.colorMode.disableSwitch = true),
      (themeConfig.colorMode.defaultMode = 'light'),
      (themeConfig.colorMode.respectPrefersColorScheme = false);
  }

  return {
    name: PLUGIN_NAME,

    getThemePath() {
      return resolve(__dirname, '../lib/theme');
    },

    getTypeScriptThemePath() {
      return resolve(__dirname, '../src/theme');
    },

    async loadContent() {
      const internalDocIds = getInternalDocIds(
        resolve(context.siteDir, 'docs')
      );
      return { internalDocIds };
    },

    async contentLoaded({ actions, content }) {
      const pluginData: PluginData = {
        internalDocIds: content.internalDocIds,
        ...siteMetadata,
      };
      const { setGlobalData } = actions;
      setGlobalData(pluginData);
    },
  };
}
