import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve, dirname } from 'path';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';

const landingPagesSourceDir = resolve(__dirname, '../../../frontend/pages');

// class on the 1st second-level item
const classMap = {
  categoryCard: 'CategoryLayout',
  categoryCard2: 'Category2Layout', // EXCEPTION: when main class contains `garmisch` or `flaine`
  productFamily: 'ProductFamilyLayout',
  subject: 'SectionLayout',
};

const allFiles = getAllFilesRecursively(landingPagesSourceDir);
const filePairs = allFiles.map((sourceFile) => ({
  sourceFile,
  targetFile: sourceFile
    .replace('frontend/pages', 'landing-pages/src/pages/landing')
    .replace('/index.json', '.tsx'),
}));

for (const file of filePairs) {
  const flailFileContents = readFileSync(file.sourceFile, {
    encoding: 'utf-8',
  });
  mkdirSync(dirname(file.targetFile), { recursive: true });
  writeFileSync(file.targetFile, JSON.stringify(flailFileContents, null, 2), {
    flag: 'w',
  });
}

// frontend/pages => landing-pages/src/pages/landing
