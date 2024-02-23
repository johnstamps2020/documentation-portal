import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getDocInfoByDocId } from '../modules/databaseOperations';
import { getAccessToken } from '../modules/auth';

async function createDitaBuildInfo(config: any, docId: string) {
  const outputRoot = process.argv[3];

  if (!outputRoot) {
    console.error(
      'Please provide a root folder to work in as the second argument'
    );
    process.exit(1);
  }

  const outputDir = `${outputRoot}/_builds`;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('Creating a DITA build info...');

  const { root, filter } = config;
  const buildInfo = { root, filter };

  const outputFilePath = `${outputDir}/${docId}.json`;
  writeFileSync(outputFilePath, JSON.stringify(buildInfo, null, 2));

  console.log(`Build file saved to ${outputFilePath}`);
}

async function createDitaTranslationKit() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('Please provide a document id as the first argument');
    process.exit(1);
  }

  const docInfo = await getDocInfoByDocId(docId);
  console.log(docInfo);
  // const buildConfig = await getEntityByAttribute('DitaBuild', 'id', docId);
  // createDitaBuildInfo(buildConfig, docId);
}

createDitaTranslationKit();
