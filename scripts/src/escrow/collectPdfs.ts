import { getMatchingDocs, DocInfo, DocQueryOptions } from '../modules/database';
import { getAccessToken } from '../modules/auth';
import fs from 'fs';
import path from 'path';
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

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

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function copyPdfsFromS3(argv: ParsedArguments) {
  let query: DocQueryOptions = { env: 'staging' };
  argv.release && (query.release = argv.release);
  argv.product && (query.product = argv.product);
  argv.version && (query.version = argv.version);
  argv.language && (query.language = argv.language);
  argv.env && (query.env = argv.env);

  let docs: DocInfo[];
  const accessToken = await getAccessToken(query.env);

  try {
    docs = await getMatchingDocs(query, accessToken);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  const outdir = argv.out ? argv.out : 'out';
  const s3region = query.env === 'prod' ? 'us-east-1' : 'us-west-2';
  const s3Client = new S3Client({
    region: s3region,
    endpoint: `https://s3.${s3region}.amazonaws.com`,
  });

  for (const docInfo of docs) {
    if (!docInfo.isDita) {
      console.log(
        `Non-DITA build for document ${docInfo.doc.id} found. Skipping...`
      );
      return;
    }

    const bucketName =
      query.env === 'prod'
        ? 'tenant-doctools-omega2-andromeda-builds'
        : 'tenant-doctools-staging-builds';
    const objectKey = docInfo.doc.url + '/pdf';

    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: objectKey,
      });

      const listResponse = await s3Client.send(listCommand);

      if (!listResponse.Contents) {
        console.error(`No objects found for prefix ${objectKey}`);
        return;
      }

      for (const item of listResponse.Contents) {
        if (item.Key && item.Key.endsWith('.pdf')) {
          const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: item.Key,
          });

          const getResponse = await s3Client.send(getCommand);

          if (getResponse.Body) {
            const stream = getResponse.Body as Readable;
            const buffer = await streamToBuffer(stream);
            const filePath = path.join(
              outdir,
              docInfo.doc.url,
              path.basename(item.Key)
            );
            fs.writeFileSync(filePath, buffer);
            console.log(`Downloaded ${item.Key} to ${filePath}`);
          }
        }
      }
    } catch (err) {
      console.error(`Error downloading ${objectKey}: ${err}`);
    }
  }
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
