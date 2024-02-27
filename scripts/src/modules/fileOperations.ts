import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
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

export function prepareBuildAndCloneDirectories(): {
  buildDir: string;
  cloneDir: string;
} {
  const outputRoot = process.argv[3];

  if (!outputRoot) {
    console.error(
      'Please provide a root folder to work in as the second argument'
    );
    process.exit(1);
  }

  const buildDir = `${outputRoot}/_builds`;
  const cloneDir = `${outputRoot}/_clones`;

  [buildDir, cloneDir].forEach((directory) => {
    if (existsSync(directory)) {
      console.log(`Removing ${directory}`);
      rmSync(directory, { recursive: true });
    }

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  });

  return { buildDir, cloneDir };
}
