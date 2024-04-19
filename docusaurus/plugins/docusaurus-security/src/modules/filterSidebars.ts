import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
const matter = require('gray-matter');

export const renameRestoreListFilePath = 'rename-restore-list.json';
const renameList: string[] = [];

function itemCanBeShown(docId: string, docsDir: string): boolean {
  if (docId === undefined) {
    console.error('docId is undefined');
    return false;
  }
  const filePathWithoutExtension = resolve(docsDir, docId);
  let filePath = filePathWithoutExtension + '.md';
  if (!existsSync(filePath)) {
    filePath = filePath + 'x';
  }
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  const fileContents = readFileSync(filePath, 'utf8');
  const frontMatter = matter(fileContents).data;

  const docIsPublic = frontMatter.public !== false;
  if (docIsPublic === true) {
    return true;
  }
  return false;
}

function filterItems(items: any[], docsDir: string): any[] {
  return items.filter((item) => {
    if (typeof item === 'string') {
      return itemCanBeShown(item, docsDir);
    }

    if (item.items) {
      item.items = filterItems(item.items, docsDir);
      return item.items.length > 0;
    }

    if (item.type === 'link') {
      return item;
    }

    if (item.type === 'doc') {
      return itemCanBeShown(item.id, docsDir);
    }

    if (typeof item === 'object') {
      const entries = Object.entries(item);
      if (entries.length === 0) {
        return false;
      }

      if (entries.length === 1) {
        const [key, value] = entries[0];
        if (typeof key === 'string' && Array.isArray(value)) {
          const filteredItems = filterItems(value, docsDir);
          item[key] = filteredItems;
          return filteredItems.length > 0;
        }
      }
    }

    return false;
  });
}

const restrictedPageTemplate = `# Restricted page

Sorry, you cannot access the contents of this page without logging in.
`;

export type RenameRestoreItem = {
  oldPath: string;
  newPath: string;
};

function renameFiles() {
  if (renameList.length === 0) {
    return;
  }

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
}

function getFilteredSidebars(sidebars: SidebarsConfig, docsDir: string) {
  // Create a copy of the sidebars object
  const filteredSidebars: SidebarsConfig = { ...sidebars };

  // Filter out the items that don't meet your criteria
  for (const key in filteredSidebars) {
    filteredSidebars[key] = filterItems(sidebars[key] as any[], docsDir);
  }

  renameFiles();
  return filteredSidebars;
}

export function filterSidebarsByAccess(
  sidebars: SidebarsConfig,
  docsDir: string
) {
  if (process.env.PUBLIC === 'true') {
    console.log('Public variant, filtering sidebars');
    return getFilteredSidebars(sidebars, docsDir);
  }

  if (process.env.PUBLIC === 'false') {
    console.log('Restricted variant, using unfiltered sidebars');
    return sidebars;
  }

  console.log('Regular build. Using unfiltered sidebars.');
  return sidebars;
}
