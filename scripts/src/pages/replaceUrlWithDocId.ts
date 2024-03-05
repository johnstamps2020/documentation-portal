import { resolve } from 'path';
import { getAllFilesRecursively } from '../modules/file';
import { LegacyDocConfig } from '../../../server/src/types/legacyConfig';
import { readFileSync, writeFileSync } from 'fs';

type DocConfig = {
  docId: string;
  docPath: string;
};

const docConfigFolder = resolve(__dirname, '../../../.teamcity/config/docs');
const pagesFolder = resolve(
  __dirname,
  '../../../landing-pages/src/pages/landing'
);
const pageUrlRegex = /url:[\n ]*'\/([^']+)',/g;

function getDocIdAndPathFromConfigFile(configFile: string): DocConfig[] {
  const configFileContents = require(configFile);
  return configFileContents.docs.map((config: LegacyDocConfig) => {
    const docId = config.id;
    const docPath = config.url;
    return { docId, docPath };
  });
}

function getAllConfigs(configFiles: string[]): DocConfig[] {
  return configFiles.reduce((acc: DocConfig[], configFile: string) => {
    const configs = getDocIdAndPathFromConfigFile(configFile);
    return [...acc, ...configs];
  }, []);
}

function getPageUrls(pageFile: string): string[] {
  const pageFileContents = readFileSync(pageFile, 'utf8');
  const matches = pageFileContents.match(pageUrlRegex);
  if (!matches) {
    return [];
  }

  return matches.map((match: string) => {
    const url = match.replace(pageUrlRegex, '$1');
    return url;
  });
}

function replaceInPageFiles(
  allPageFiles: string[],
  allDocConfigs: DocConfig[]
) {
  for (const pageFile of allPageFiles) {
    const pageUrls = getPageUrls(pageFile);
    if (!pageUrls.length) {
      continue;
    }

    for (const pageUrl of pageUrls) {
      const matchingDocConfig = allDocConfigs.find((config) =>
        pageUrl.startsWith(config.docPath)
      );
      if (!matchingDocConfig) {
        console.log(
          `No matching doc config found for page url: ${pageUrl} in file: ${pageFile}`
        );
        continue;
      }

      const replacement = `docId: '${matchingDocConfig.docId}',
                            pathInDoc: '${pageUrl.replace(
                              `${matchingDocConfig.docPath}/`,
                              ''
                            )}'`;
      const newPageFileContents = readFileSync(pageFile, 'utf8').replace(
        `url: '/${pageUrl}'`,
        replacement
      );
      console.log(`Replacing ${pageUrl}
                                  with ${replacement}`);
      writeFileSync(pageFile, newPageFileContents);
    }
  }
}

const allDocConfigFiles = getAllFilesRecursively(docConfigFolder);
const allDocConfigs = getAllConfigs(allDocConfigFiles);

const allPageFiles = getAllFilesRecursively(pagesFolder);
replaceInPageFiles(allPageFiles, allDocConfigs);
