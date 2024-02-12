import { existsSync, mkdirSync, writeFileSync } from 'fs';

async function createDitaBuildInfo() {
  const docId = process.argv[2];

  if (!docId) {
    console.error('Please provide a document id as the first argument');
    process.exit(1);
  }

  const outputRoot = process.argv[3];

  if (!outputRoot) {
    console.error(
      'Please provide a root folder to work in as the second argument'
    );
    process.exit(1);
  }

  const outputDir = `${process.cwd()}/_builds`;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('Creating a DITA build info...');

  const configResponse = await fetch(
    'https://docs.guidewire.com/safeConfig/entity/DitaBuild/all'
  );

  if (!configResponse.ok) {
    console.error('Failed to fetch DITA build configuration');
    process.exit(1);
  }

  const config = await configResponse.json();

  const doc = config.find((doc: any) => doc.id.endsWith(docId));

  if (!doc) {
    console.error(`Document with id ${docId} not found`);
    process.exit(1);
  }

  console.log('Retrieved information for the matching doc');

  const buildInfo = { root: doc.root, filter: doc.filter };

  const outputFilePath = `${outputDir}/${docId}.json`;
  writeFileSync(outputFilePath, JSON.stringify(buildInfo, null, 2));

  console.log(`Build file saved to ${outputFilePath}`);
}

createDitaBuildInfo();
