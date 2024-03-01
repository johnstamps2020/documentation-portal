import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync
} from 'fs';
import { join } from 'path';

export function copyDocusaurusTranslationFiles(
  sourceDir: string,
  targetDir: string
) {
  console.log('Creating a Docusaurus translation kit...');

  const i18nDir = `${sourceDir}/i18n/en`;
  const docsDir = `${sourceDir}/docs`;
  const i18nOutputDir = `${targetDir}`;
  const docsOutputDir = `${targetDir}/docusaurus-plugin-content-docs/current`;

  // create the output folders if they don't exist
  const outputDirs = [i18nOutputDir, docsOutputDir];
  outputDirs.forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // copy al files from the `docs` folder to the output folder
  const copyFiles = (source: string, target: string) => {
    readdirSync(source).forEach((name) => {
      const sourceFile = join(source, name);
      const targetFile = join(target, name);
      if (lstatSync(sourceFile).isDirectory()) {
        mkdirSync(targetFile, { recursive: true });
        copyFiles(sourceFile, targetFile);
      } else {
        copyFileSync(sourceFile, targetFile);
      }
    });
  };

  copyFiles(i18nDir, i18nOutputDir);
  copyFiles(docsDir, docsOutputDir);
  console.log('Docusaurus translation kit created successfully!');
}
