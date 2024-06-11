import { getMatchingDocs, DocInfo, DocQueryOptions } from '../modules/database';
import { getAccessToken } from '../modules/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// TODO add documentation.

interface ParsedArguments {
  release?: string;
  product?: string;
  version?: string;
  language?: string;
  env: 'staging' | 'prod';
  out?: string;
  _: (string | number)[];
  $0: string;
}

async function collectPdfs() {
  const argv: ParsedArguments = parseArgs();

  // TODO: TBD: allow release + product as a combo?
  if (!argv.release && (!argv.product || !argv.version)) {
    console.error('Must specify a release or a product and version.');
    process.exit(1);
  }

  // if (argv.product) {
  //   console.log(`Product: ${argv.product}`);
  //   if (!argv.version) {
  //     console.error('Must specify a version when specifying a product.');
  //     process.exit(1);
  //   }
  // }

  // if (argv.version) {
  //   console.log(`Version: ${argv.version}`);
  //   if (!argv.product) {
  //     console.error('Must specify a product when specifying a version.');
  //     process.exit(1);
  //   }
  // }
  await copyPdfsFromS3(argv);

  const outdir = argv.out ? argv.out : 'out';
  movePdfFilesAndDeleteDir(outdir);
}

async function copyPdfsFromS3(argv: ParsedArguments) {
  const accessToken = await getAccessToken();
  let query: DocQueryOptions = { env: 'prod' };
  argv.release && (query.release = argv.release);
  argv.product && (query.product = argv.product);
  argv.version && (query.version = argv.version);
  argv.language && (query.language = argv.language);
  argv.env && (query.env = argv.env);

  let docs: DocInfo[];

  try {
    docs = await getMatchingDocs(query, accessToken);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  const outdir = argv.out ? argv.out : 'out';
  const execPromise = promisify(exec);

  const copyCommands = docs.map((docInfo) => {
    if (!docInfo.isDita) {
      console.log(
        `Non-DITA build for document ${docInfo.doc.id} found. Skipping...`
      );
      return Promise.resolve(); // Skip this doc
    }

    const s3Url =
      query.env === 'prod'
        ? 'tenant-doctools-omega2-andromeda-builds'
        : 'tenant-doctools-staging-builds';
    const awsCliCommand = `aws s3 cp s3://${s3Url}/${docInfo.doc.url} ${outdir}/${docInfo.doc.url} --recursive --exclude "*" --include "*.pdf"`;

    return execPromise(awsCliCommand)
      .then(({ stdout, stderr }) => {
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
      })
      .catch((err) => {
        console.error(`Error executing command: ${err}`);
      });
  });

  await Promise.all(copyCommands);
}

function parseArgs(): ParsedArguments {
  const validEnvs = ['staging', 'prod'] as const;
  type Env = (typeof validEnvs)[number];

  const validLangs = [
    'en',
    'de',
    'es-419',
    'es-ES',
    'fr',
    'it',
    'ja',
    'nl',
  ] as const;
  type Lang = (typeof validLangs)[number];

  return yargs(hideBin(process.argv))
    .version(false)
    .option('release', {
      alias: 'r',
      type: 'string',
      description: 'Release name, such as "Kufri',
    })
    .option('product', {
      alias: 'p',
      type: 'string',
      description: 'Product name, such as "PolicyCenter"',
    })
    .option('version', {
      alias: 'v',
      type: 'string',
      description: 'Version number, such as "10.2.3"',
    })
    .option('language', {
      alias: 'l',
      type: 'string',
      choices: validLangs,
      description: 'Language code, such as "en" for English',
    })
    .option('env', {
      alias: 'e',
      type: 'string',
      choices: validEnvs,
      description: 'Environment. Either "staging" or "prod".',
    })
    .option('out', {
      alias: 'o',
      type: 'string',
      description:
        'Output directory. If not specified, output is placed in an /out directory relative to where script is run.',
    })
    .help().argv as ParsedArguments;
}

async function movePdfFilesAndDeleteDir(dir: string) {
  // Read the contents of the directory
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        if (file.name === 'pdf') {
          fs.readdir(fullPath, (err, pdfFiles) => {
            if (err) {
              console.error(
                `Error reading pdf directory ${fullPath}: ${err.message}`
              );
              return;
            }

            pdfFiles.forEach((pdfFile) => {
              const pdfFilePath = path.join(fullPath, pdfFile);
              if (path.extname(pdfFile) === '.pdf') {
                const newFilePath = path.join(dir, pdfFile);

                // Move the .pdf file to the parent directory
                fs.rename(pdfFilePath, newFilePath, (err) => {
                  if (err) {
                    console.error(
                      `Error moving file ${pdfFilePath} to ${newFilePath}: ${err.message}`
                    );
                    return;
                  }

                  console.log(`Moved ${pdfFilePath} to ${newFilePath}`);

                  // Remove the 'pdf' directory after moving the file
                  fs.rmdir(fullPath, (err) => {
                    if (err) {
                      console.error(
                        `Error removing directory ${fullPath}: ${err.message}`
                      );
                      return;
                    }

                    console.log(`Removed directory ${fullPath}`);
                  });
                });
              }
            });
          });
        } else {
          // Recursively search in subdirectories
          movePdfFilesAndDeleteDir(fullPath);
        }
      }
    });
  });
}

collectPdfs().catch((err) => {
  console.error(`Error in collectPdfs: ${err}`);
  process.exit(1);
});

// Example commands:
// To collect all Kufri PDFs from prod, all products, versions, and languages
// yarn scripts:collect-pdfs --release Kufri
//
// To collect all PolicyCenter 10.2.3 PDFs from prod for English only:
// yarn scripts:collect-pdfs --product PolicyCenter --version 10.2.3 --language en
//
// To collect all PolicyCenter 10.2.3 PDFs from staging for English only (for testing):
// yarn scripts:collect-pdfs --product=PolicyCenter --version 10.2.3 --language en --env staging
//
// To collect all PolicyCenter 10.2.3 PDFs from staging for English only and output to /foo:
// yarn scripts:collect-pdfs --product=PolicyCenter --version 10.2.3 --language en --env staging --out foo
//
// Arguments can be shortened:
// --r for --release
// --p for --product
// --v for --version
// --l for --language
// --e for --env
// --o for --out
