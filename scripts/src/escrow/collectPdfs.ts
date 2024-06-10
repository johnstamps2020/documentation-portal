import { getMatchingDocs, DocInfo, DocQueryOptions } from '../modules/database';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// TODO add documentation.

async function collectPdfs() {
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

  const argv = yargs(hideBin(process.argv))
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
    .help().argv;

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

  let query: DocQueryOptions = { env: 'prod' };
  argv.release && (query.release = argv.release);
  argv.product && (query.product = argv.product);
  argv.version && (query.version = argv.version);
  argv.language && (query.language = argv.language);
  argv.env && (query.env = argv.env);

  let docs: DocInfo[];

  try {
    docs = await getMatchingDocs(query);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  const outdir = argv.out ? argv.out : 'out';
  const execPromise = promisify(exec);

  docs.forEach(async (docInfo) => {
    const docId = docInfo.doc.id;

    if (!docInfo.isDita) {
      console.log(
        `Non-DITA build for document ${docInfo.doc.id} found. Skipping...`
      );
      return;
    }
    const s3Url =
      argv.env === 'prod'
        ? 'tenant-doctools-omega2-andromeda-builds'
        : 'tenant-doctools-staging-builds';
    const awsCliCommand = `aws s3 cp s3://${s3Url}/${docInfo.doc.url} ${outdir}/${docInfo.doc.url} --recursive --exclude "*" --include "*.pdf"`;

    const runAwsCliCommand = async () => {
      try {
        const { stdout, stderr } = await execPromise(awsCliCommand);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      } catch (err) {
        console.error(`Error executing command: ${err}`);
      }
    };

    runAwsCliCommand();
  });
}

collectPdfs();

// Example command:
// yarn scripts:collect-pdfs
