import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from 'fs';
import { join } from 'path';

console.log('Creating a Docusaurus translation kit...');

const workingDir = process.argv[2];
console.log('Current directory:', workingDir);

const i18nDir = `${workingDir}/i18n/en`;
const docsDir = `${workingDir}/docs`;
const outputDir = `${workingDir}/${process.env.OUTPUT_DIR || 'out/i18n/en'}`;
const i18nOutputDir = `${outputDir}`;
const docsOutputDir = `${outputDir}/docusaurus-plugin-content-docs/current`;
console.log('Output directory:', outputDir);

// create the output folders if they don't exist
const outputDirs = [outputDir, i18nOutputDir, docsOutputDir];
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
