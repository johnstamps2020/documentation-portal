import { rmdirSync } from 'fs';
import { rmdir } from 'fs/promises';
import { resolve } from 'path';
import { rimrafSync } from 'rimraf';

const dirsToDelete = [
  resolve(__dirname, '../../static/generated'),
  resolve(__dirname, '../../docs/generated'),
];

function deleteRecursively(directoryPath: string): void {
  console.log(`Deleting ${directoryPath}`);
  rimrafSync(directoryPath);
  console.log('Deleted!');
}

dirsToDelete.forEach((directoryPath) => deleteRecursively(directoryPath));
