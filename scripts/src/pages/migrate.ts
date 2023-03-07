import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const landingPagesSourceDir = resolve(__dirname, '../../../frontend/pages');

// class on the 1st second-level item
const classMap = {
  categoryCard: 'CategoryLayout',
  categoryCard2: 'Category2Layout', // EXCEPTION: when main class contains `garmisch` or `flaine`
  productFamily: 'ProductFamilyLayout',
  subject: 'SectionLayout',
};

const allFiles = getAllFilesRecursively(landingPagesSourceDir, '.json');
writeFileSync('allFiles.json', JSON.stringify(allFiles, null, 2));
