import { rmdirSync } from 'fs';
import { rmdir } from 'fs/promises';
import { resolve } from 'path';

const dirsToDelete = [
  resolve(__dirname, '../../static/generated'),
  resolve(__dirname, '../../docs/generated'),
];

function deleteRecursively(directoryPath: string): void {
  console.log(`Deleting ${directoryPath}`);
  rmdirSync(directoryPath);
  console.log('Deleted!');
}

dirsToDelete.forEach((directoryPath) => deleteRecursively(directoryPath));
