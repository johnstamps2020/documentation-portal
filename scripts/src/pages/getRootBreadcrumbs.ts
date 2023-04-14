import { dirname, parse, relative, resolve } from 'path';
import { getAllFilesRecursively } from '../modules/fileOperations';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

type DocRootPages = {
  docId: string;
  rootPages: string[];
};

const landingPagesSourceDir = resolve(
  __dirname,
  '../../../landing-pages/src/pages/landing'
);
const targetFile = resolve(__dirname, '../../out/root-breadcrumbs.json');
const allFiles = getAllFilesRecursively(landingPagesSourceDir);

function getFilePath(absoluteFilePath: string): string {
  const relativeFilePath = relative(
    dirname(landingPagesSourceDir),
    absoluteFilePath
  );
  const parsedFilePath = parse(relativeFilePath);
  return `/${parsedFilePath.dir}/${parsedFilePath.name}`;
}

const breadcrumbs: DocRootPages[] = [];

for (const file of allFiles) {
  const fileContents = readFileSync(file, {
    encoding: 'utf-8',
  });
  const filePath = getFilePath(file);
  const regex = /docId:\s*'([^']*)'/g;
  const matches = [...fileContents.matchAll(regex)].map((match) => match[1]);
  if (matches.length > 0 && filePath) {
    matches.forEach((match) => {
      const matchingBreadcrumb = breadcrumbs.find((b) => b.docId === match);
      if (index === -1) {
        breadcrumbs.push({ docId: match, rootPages: [filePath] });
      } else {
        const matchingBreadcrumb = breadcrumbs[index];
        if (!matchingBreadcrumb.rootPages.includes(filePath)) {
          matchingBreadcrumb.rootPages.push(filePath);
        }
      }
    });
  }
}
mkdirSync(dirname(targetFile), { recursive: true });
writeFileSync(targetFile, JSON.stringify(breadcrumbs, null, 2), {
  encoding: 'utf-8',
});
