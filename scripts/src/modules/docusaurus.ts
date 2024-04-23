import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from 'fs';
import { extname, join } from 'path';
import matter = require('gray-matter');

function isInternalMarkdownFile(filePath: string): boolean {
  if (!['.md', '.mdx'].includes(extname(filePath))) {
    return false;
  }

  const fileContents = readFileSync(filePath, 'utf-8');
  const frontMatter = matter(fileContents).data;

  if (frontMatter?.internal === true) {
    console.log(
      filePath,
      'is internal and will not be included in translations'
    );
    return true;
  }

  return false;
}

function copyDocusaurusFiles(sourceDir: string, targetDir: string) {
  const allPathsInDirectory = readdirSync(sourceDir);

  for (const fileName of allPathsInDirectory) {
    const sourceFile = join(sourceDir, fileName);

    if (isInternalMarkdownFile(sourceFile)) {
      continue;
    }

    const targetFile = join(targetDir, fileName);
    if (lstatSync(sourceFile).isDirectory()) {
      mkdirSync(targetFile, { recursive: true });
      copyDocusaurusFiles(sourceFile, targetFile);
    } else {
      copyFileSync(sourceFile, targetFile);
    }
  }
}

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

  copyDocusaurusFiles(i18nDir, i18nOutputDir);
  copyDocusaurusFiles(docsDir, docsOutputDir);
  console.log('Docusaurus translation kit created successfully!');
}
