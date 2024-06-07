import { getAllDocs, getMatchingDocs } from '../modules/database';
import { Doc } from '@doctools/server';
import { exec } from 'child_process';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// TODO update to get buildType for each doc and only get PDFs for DITA builds
// TODO add documentation

async function collectPdfs() {
  // Parsing command line arguments
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
    .help().argv;

  // TBD: allow release + product as a combo?
  if (!argv.release && (!argv.product || !argv.version)) {
    console.error('Must specify a release or a product and version.');
    process.exit(1);
  }
  console.log('Collecting doc configuration information for docs with...');
  if (argv.release) {
    console.log(`Release: ${argv.release}`);
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

  let docs: Doc[];

  try {
    //docs = await getAllDocs();
    docs = await getMatchingDocs(argv.release, argv.product, argv.version);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  // approach if fetching all doc configs
  // if (argv.release) {
  //   docs = docs.filter((doc) =>
  //     doc.releases?.some((release) => release.name === argv.release)
  //   );
  // }

  // if (argv.product && argv.version) {
  //   docs = docs.filter((doc) =>
  //     doc.platformProductVersions?.some(
  //       (ppv) =>
  //         ppv.product.name === argv.product && ppv.version.name === argv.version
  //     )
  //   );
  // }

  // console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
  // console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
  // console.log('AWS_DEFAULT_REGION:', process.env.AWS_DEFAULT_REGION);
  const outdir = 'out';
  docs.forEach((doc) => {
    const docId = doc.id;
    const releaseNames = doc.releases?.reduce((acc, currentRelease) => {
      return acc + currentRelease.name + ' ';
    }, '');
    const productNames = doc.platformProductVersions?.reduce(
      (acc, currentPPV) => {
        return acc + currentPPV.product.name + ' ';
      },
      ''
    );

    console.log(
      `ID: ${doc.id} -- URL: ${doc.url} -- Releases: ${releaseNames} -- Products: ${productNames}
      `
    );

    const awsCliCommand = `aws s3 cp s3://tenant-doctools-omega2-andromeda-builds/${doc.url} ${outdir}/${doc.url} --recursive --exclude "*" --include "*.pdf"`;

    exec(awsCliCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    });
  });
  //console.log(docs);
}

collectPdfs();

// Example command:
// yarn scripts:collect-pdfs
