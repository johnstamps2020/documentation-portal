import { dirname, parse, relative, resolve } from 'path';
import { getAllFilesRecursively } from '../modules/fileOperations';
import { readFileSync, writeFileSync } from 'fs';

type DocRootPages = {
  docId: string;
  rootPages: string[];
};

const landingPagesSourceDir = resolve(
  __dirname,
  '../../../landing-pages/src/pages/landing'
);
const targetFile = resolve(__dirname, 'root-breadcrumbs.json');
const allFiles = getAllFilesRecursively(landingPagesSourceDir);

function mergeBreadcrumbs(breadcrumbs: DocRootPages[]) {
  const mergedBreadcrumbs: DocRootPages[] = [];
  breadcrumbs.forEach((obj) => {
    const index = mergedBreadcrumbs.findIndex((o) => o.docId === obj.docId);
    if (index === -1) {
      mergedBreadcrumbs.push({ docId: obj.docId, rootPages: obj.rootPages });
    } else {
      mergedBreadcrumbs[index].rootPages.push(...obj.rootPages);
    }
  });
  return mergedBreadcrumbs;
}

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
      breadcrumbs.push({
        docId: match,
        rootPages: [filePath],
      });
    });
  }
}
const mergedBreadcrumbs = mergeBreadcrumbs(breadcrumbs);
writeFileSync(targetFile, JSON.stringify(mergedBreadcrumbs, null, 2), {
  encoding: 'utf-8',
});
