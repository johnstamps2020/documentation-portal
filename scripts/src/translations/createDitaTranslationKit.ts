import { writeFileSync } from 'fs';
import { DocInfo, getDocInfoByDocId } from '../modules/databaseOperations';
import { cloneRepositoryForDoc } from '../modules/gitOperations';
import { prepareBuildAndCloneDirectories } from '../modules/fileOperations';

const { buildDir, cloneDir } = prepareBuildAndCloneDirectories();

async function createDitaBuildInfo(config: any, docId: string) {
  console.log('Creating a DITA build info...');

  const { root, filter } = config;
  const buildInfo = { root, filter };

  const outputFilePath = `${buildDir}/${docId}.json`;
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
  await cloneRepositoryForDoc(docInfo, cloneDir);
  await buildDitaOutput(docInfo, cloneDir);

  createDitaBuildInfo(docInfo.build, docId);
}

createDitaTranslationKit();


function buildDitaOutput(docInfo: DocInfo, cloneDir: string) {
  throw new Error('Function not implemented.');
}
// Example command:
// yarn scripts:create-dita-translation-kit dhrn202310 ~/git-repos/documentation-portal/out
