import { getAccessToken } from '../modules/auth';
import { deleteEntityById, getDocInfoByDocId } from '../modules/database';

type BuildType = 'DitaBuild' | 'YarnBuild';

async function deleteDoc() {
  const timerLabel = 'Time needed to delete doc';
  console.time(timerLabel);

  const docId = process.env.DOC_ID;
  const host = process.env.HOST;
  const buildType = process.env.BUILD_TYPE;
  if (docId === undefined || host === undefined || buildType === undefined) {
    console.error(`Cannot proceed! Please set the required environment variables:
        DOC_ID,
        HOST,
        BUILD_TYPE`);
    return process.exit(1);
  }

  const accessToken = await getAccessToken();
  const docInfo = await getDocInfoByDocId(docId, accessToken);
  console.log({ docInfo });

  const buildId = docInfo.build.id;
  await deleteEntityById(buildType as BuildType, buildId, accessToken, host);
  await deleteEntityById('Doc', docId, accessToken, host);

  console.timeEnd(timerLabel);
}

deleteDoc();
