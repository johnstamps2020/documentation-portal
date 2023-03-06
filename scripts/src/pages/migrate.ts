import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve } from 'path';

const landingPagesSourceDir = resolve(__dirname, '../../../frontend/pages');

const allFiles = getAllFilesRecursively(landingPagesSourceDir, '.json');
console.log(allFiles);
