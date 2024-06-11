import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { getDocInfoByDocId } from '../modules/database';
import {
  copyFilesBasedOnBuildData,
  createDitaBuildInfo,
} from '../modules/dita';
import { copyDocusaurusTranslationFiles } from '../modules/docusaurus';
import { cloneRepositoryForDoc } from '../modules/git';
import { getAccessToken } from '../modules/auth';

type TranslationKitOutputDirectoryConfig = {
  buildDir: string;
  cloneDir: string;
  kitDir: string;
};

type TranslationKitType = 'dita' | 'docusaurus';

function prepareTranslationKitOutputDirectories(): TranslationKitOutputDirectoryConfig {
  const outputRoot = process.argv[3];

  if (!outputRoot) {
    console.error(
      'Please provide a root folder to work in as the second argument'
    );
    process.exit(1);
  }

  const kitDir = `${outputRoot}/_kit`;
  const buildDir = `${kitDir}/_builds`;
  const cloneDir = `${outputRoot}/_clone`;

  [buildDir, cloneDir].forEach((directory) => {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  });

  return { buildDir, cloneDir, kitDir };
}

async function createTranslationKit() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('Please provide a document id as the first argument');
    process.exit(1);
  }

  const { cloneDir, kitDir, buildDir } =
    prepareTranslationKitOutputDirectories();

  const accessToken = await getAccessToken();
  const docInfo = await getDocInfoByDocId(docId, accessToken);

  const translationKitType: TranslationKitType = docInfo.isDita
    ? 'dita'
    : 'docusaurus';

  await cloneRepositoryForDoc(docInfo, cloneDir);

  if (translationKitType === 'dita') {
    await copyFilesBasedOnBuildData(docInfo.doc.url, cloneDir, kitDir);
    createDitaBuildInfo(docInfo.build, docId, buildDir);
  }

  if (translationKitType === 'docusaurus') {
    const workingDir = docInfo.build.workingDir
      ? join(cloneDir, docInfo.build.workingDir)
      : cloneDir;
    copyDocusaurusTranslationFiles(workingDir, kitDir);
    rmSync(buildDir, { recursive: true, force: true });
  }
}

createTranslationKit();

// Example command:
// yarn scripts:create-translation-kit dhrn202310 ~/git-repos/documentation-portal/out
