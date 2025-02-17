import { getAccessToken } from '../modules/auth';
import { getDocInfoByDocId } from '../modules/database';
//import shelljs = require('shelljs');
let os = require('os');

async function setDownloadableBuildParams() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('Please provide a document id as the first argument');
    process.exit(1);
  }

  const accessToken = await getAccessToken();
  const docInfo = await getDocInfoByDocId(docId, 'staging', accessToken);

  if (!docInfo.isDita) {
    console.error(
      `Document ${docId} is not a DITA document. Downloadable builds are only available for DITA documents.`
    );
    process.exit(1);
  }

  process.stdout.write(
    `##teamcity[setParameter name='ROOT_MAP' value='${docInfo.build.root}']` +
      os.EOL
  );
  process.stdout.write(
    `##teamcity[setParameter name='FILTER' value='${docInfo.build.filter}']` +
      os.EOL
  );
  process.stdout.write(
    `##teamcity[setParameter name='INDEX_REDIRECT' value='${docInfo.build.indexRedirect}']` +
      os.EOL
  );
  process.stdout.write(
    `##teamcity[setParameter name='GIT_URL' value='${docInfo.source.gitUrl}']` +
      os.EOL
  );
  process.stdout.write(
    `##teamcity[setParameter name='GIT_BRANCH' value='${docInfo.source.gitBranch}']` +
      os.EOL
  );
}

setDownloadableBuildParams();

// Example command:
// yarn scripts:set-downloadable-build-params dhrn202310
