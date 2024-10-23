import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

// This list is a duplicate of the one in landing-pages/src/components/LanguageContext/LanguageContext.tsx
// I couldn't find a way to import between .mjs and Typescript 😅
const LOCALES = [
  'de',
  'en',
  'es-419',
  'es-ES',
  'fr',
  'it',
  'ja',
  'nl',
  'pl',
  'pt',
  'yy',
];

const execAsync = promisify(exec);

const CONFIG = {
  inputDir: 'i18n',
  outputDir: 'src/components/LanguageContext/compiled-lang',
};

async function compileLocale(locale) {
  const inputFile = path.join(CONFIG.inputDir, `${locale}.json`);
  const outputFile = path.join(CONFIG.outputDir, `${locale}.json`);

  try {
    await fs.access(inputFile);

    const command = `formatjs compile ${inputFile} --ast --out-file ${outputFile}`;
    const { stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Error compiling ${locale}:`, stderr);
      return false;
    }

    console.log(`✓ Successfully compiled ${locale}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠ Warning: ${locale}.json not found in ${CONFIG.inputDir}`);
    } else {
      console.error(`Error processing ${locale}:`, error.message);
    }
    return false;
  }
}

async function main() {
  console.log('Starting locale compilation...');

  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create output directory:', error.message);
    process.exit(1);
  }

  const results = await Promise.all(
    LOCALES.map((locale) => compileLocale(locale))
  );

  const successCount = results.filter(Boolean).length;
  console.log(
    `\nCompilation complete: ${successCount}/${LOCALES.length} locales processed successfully`
  );

  if (successCount !== LOCALES.length) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
