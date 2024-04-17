import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { isPublicBuild } from './helpers';
const matter = require('gray-matter');

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

export function filterSidebarsByAccess(
  sidebars: SidebarsConfig,
  docsDir: string
) {
  const canShowAllDocs = !isPublicBuild();
  if (canShowAllDocs) {
    console.log('Regular build, showing all docs');
    return sidebars;
  } else {
    console.log('Restricted build, filtering docs');
  }
  // Create a copy of the sidebars object
  const filteredSidebars: SidebarsConfig = { ...sidebars };

  // Filter out the items that don't meet your criteria
  for (const key in filteredSidebars) {
    filteredSidebars[key] = filterItems(sidebars[key] as any[], docsDir);
  }

  return filteredSidebars;
}
