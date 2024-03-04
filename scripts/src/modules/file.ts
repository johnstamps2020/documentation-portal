import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';

export function getAllFilesRecursively(rootDir: string): string[] {
  const filesAndFolders = readdirSync(rootDir);
  return filesAndFolders
    .map((fileOrFolder) => {
      const absolutePath = resolve(rootDir, fileOrFolder);
      if (statSync(absolutePath).isDirectory()) {
        return getAllFilesRecursively(absolutePath);
      }

      return absolutePath;
    })
    .flat();
}
