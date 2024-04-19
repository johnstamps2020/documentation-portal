import { readFileSync, readdirSync, renameSync, writeFileSync } from 'fs';
import { basename, dirname, extname, resolve } from 'path';
const matter = require('gray-matter');

export const renameRestoreListFilePath = 'rename-restore-list.json';
const restrictedPageTemplate = `# Restricted page

Sorry, you cannot access the contents of this page without logging in.
`;

function getAllDocFilesRecursively(dirPath: string) {
  const dirList = readdirSync(dirPath, { recursive: true });
  const onlyDocFiles = dirList.filter(
    (filePath) =>
      typeof filePath === 'string' &&
      ['.md', '.mdx'].includes(extname(filePath))
  );
  return onlyDocFiles.map((filePath) => resolve(dirPath, filePath as string));
}

export type RenameRestoreItem = {
  oldPath: string;
  newPath: string;
};

export function renameFiles() {
  console.log('Parsing files to find restricted ones...');
  const renameList: string[] = [];

  const allDocFiles = getAllDocFilesRecursively('docs');

  for (const docPath of allDocFiles) {
    const docContents = readFileSync(docPath);
    const frontMatter = matter(docContents).data;
    console.log(docPath, { frontMatter });
    if (frontMatter.public === false) {
      renameList.push(docPath);
    }
  }

  if (renameList.length === 0) {
    console.log('No files to restrict');
    return;
  }

  console.log('Creating placeholders for restricted files', renameList);
  const renameRestoreList: RenameRestoreItem[] = [];
  for (const oldPath of renameList) {
    const newPath = resolve(dirname(oldPath), '_' + basename(oldPath));
    console.log('Renaming', oldPath, newPath);
    renameSync(oldPath, newPath);
    writeFileSync(oldPath, restrictedPageTemplate, 'utf-8');
    renameRestoreList.push({
      oldPath,
      newPath,
    });
  }

  writeFileSync(
    renameRestoreListFilePath,
    JSON.stringify(renameRestoreList),
    'utf-8'
  );

  console.log('Completed the process of restricting access to files!');
}
