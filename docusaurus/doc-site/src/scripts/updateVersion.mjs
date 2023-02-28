import { join, dirname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const themePath = join(
  __dirname,
  '../../../themes/gw-theme-classic/package.json'
);

const docSitePath = join(__dirname, '../../package.json');

function getPackageObject(packageFilePath) {
  return JSON.parse(readFileSync(packageFilePath, { encoding: 'utf-8' }));
}

function updateThemeVersion() {
  const themePackage = getPackageObject(themePath);
  const docSitePackage = getPackageObject(docSitePath);

  docSitePackage.dependencies[themePackage.name] = themePackage.version;

  writeFileSync(docSitePath, JSON.stringify(docSitePackage, null, 2));
}

updateThemeVersion();
