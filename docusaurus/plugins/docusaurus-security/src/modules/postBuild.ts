import { existsSync, readFileSync, rmSync } from 'fs';
import jsdom from 'jsdom';
import { extname, join, resolve } from 'path';
import { isPublicBuild } from './helpers';
const { JSDOM } = jsdom;

function getHtmlFilePath(routePath: string): string | undefined {
  if (!existsSync(routePath)) {
    return undefined;
  }

  if (extname(routePath) === '.html') {
    return routePath;
  }

  const indexHtmlPath = resolve(routePath, 'index.html');
  if (existsSync(indexHtmlPath)) {
    return indexHtmlPath;
  }
}

export function deleteRestrictedFiles(
  routesPaths: string[],
  outDir: string
): void {
  if (isPublicBuild() || routesPaths.length === 0) {
    return;
  }

  console.log('Deleting restricted files...');
  routesPaths.forEach((route) => {
    const routePath = join(outDir, route);
    const filePath = getHtmlFilePath(routePath);
    if (!filePath) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const fileContents = readFileSync(filePath, 'utf8');
    // read HTML file as HTML DOM
    const htmlString = new JSDOM(fileContents);
    const metaTag = htmlString.window.document.querySelector(
      'meta[name="com.guidewire.metadata:public"]'
    );

    if (!metaTag) {
      return;
    }

    if (metaTag.getAttribute('content') === 'true') {
      return;
    }

    try {
      console.log(`Deleting ${routePath}`);
      rmSync(routePath, { recursive: true });
    } catch (error) {
      console.error(`Failed to delete ${routePath}`);
      console.error('ABORTING BUILD');
      process.exit(1);
    }
  });
}
