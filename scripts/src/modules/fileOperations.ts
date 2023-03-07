import { readdirSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export function getAllFilesRecursively(
  rootDir: string,
  extension?: string
): (string | undefined)[] {
  const filesAndFolders = readdirSync(rootDir);
  return filesAndFolders
    .map((fileOrFolder) => {
      const absolutePath = resolve(rootDir, fileOrFolder);
      if (statSync(absolutePath).isDirectory()) {
        return getAllFilesRecursively(absolutePath);
      }

      if (!extension || extname(absolutePath) === extension) {
        return absolutePath;
      }
    })
    .flat()
    .filter(Boolean);
}
