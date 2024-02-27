import { writeFileSync } from 'fs';
import { DocInfo, getDocInfoByDocId } from '../modules/databaseOperations';
import { prepareBuildAndCloneDirectories } from '../modules/fileOperations';
import { cloneRepositoryForDoc } from '../modules/gitOperations';

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
  const buildData = await getBuildData(docInfo.doc.url);
  console.log(buildData);

  createDitaBuildInfo(docInfo.build, docId);
}

createDitaTranslationKit();

async function getBuildData(docUrl: DocInfo) {
  const buildDataUrl = `https://docportal-content.staging.ccs.guidewire.net/${docUrl}/build-data.json`;
  console.log(`Getting build info from ${buildDataUrl}`);
  const response = await fetch(buildDataUrl);

  if (!response.ok) {
    console.error(
      `Failed to get build info from ${buildDataUrl}, status code: ${response.status}`
    );
    process.exit(1);
  }

  const buildData = await response.json();
  return buildData;
}

// Example command:
// yarn scripts:create-dita-translation-kit dhrn202310 ~/git-repos/documentation-portal/out
