import { existsSync, mkdirSync, rmSync } from 'fs';
import { getDocInfoByDocId } from '../modules/database';
import {
  createDitaBuildInfo,
  copyFilesBasedOnBuildData,
} from '../modules/dita';
import { cloneRepositoryForDoc } from '../modules/git';

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
    if (existsSync(directory)) {
      console.log(`Removing ${directory}`);
      rmSync(directory, { recursive: true });
    }

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  });

  return { buildDir, cloneDir, kitDir };
}

async function createTranslationKit() {
  const { cloneDir, kitDir, buildDir } =
    prepareTranslationKitOutputDirectories();

  const docId = process.argv[2];
  if (!docId) {
    console.error('Please provide a document id as the first argument');
    process.exit(1);
  }

  const docInfo = await getDocInfoByDocId(docId);

  const translationKitType: TranslationKitType = docInfo.isDita
    ? 'dita'
    : 'docusaurus';

  await cloneRepositoryForDoc(docInfo, cloneDir);

  if (translationKitType === 'dita') {
    await copyFilesBasedOnBuildData(docInfo.doc.url, cloneDir, kitDir);
    createDitaBuildInfo(docInfo.build, docId, buildDir);
  }

  if (translationKitType === 'docusaurus') {
    console.log('Docusaurus translation kit creation is not yet implemented');
  }
}

createTranslationKit();

// Example command:
// yarn scripts:create-translation-kit dhrn202310 ~/git-repos/documentation-portal/out
