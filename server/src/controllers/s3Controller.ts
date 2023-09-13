import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import { FileArray, UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const s3 = new S3({ apiVersion: '2006-03-01' });
// TODO: Hardcoding the bucket name to staging to simulate prod on staging.
//  Revert this change after testing is done
const bucketParams = {
  Bucket: `tenant-doctools-staging-builds`,
};

export async function getConfigFile(
  localDir: string,
  localFilename: string,
  remotePath: string
) {
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(`${localDir}/${localFilename}`);
      file.on('finish', () => {
        resolve('success');
      });
      file.on('error', (err) => {
        reject(err);
      });
      s3.getObject({ ...bucketParams, Key: remotePath })
        .then((response) => response.Body as Readable)
        .then((body) => body.pipe(file));
    });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
}

export async function listItems(prefix: string) {
  try {
    return s3.listObjects({ ...bucketParams, Prefix: prefix });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
}

export async function addItems(
  filesFromClient: UploadedFile | FileArray,
  prefix: string
) {
  try {
    const fileResults = [];
    const filesIterable = (function () {
      if (Array.isArray(filesFromClient)) {
        return filesFromClient;
      } else {
        return [filesFromClient];
      }
    })();
    for await (const file of filesIterable) {
      fileResults.push(
        await new Upload({
          client: s3,

          params: {
            ...bucketParams,
            Body: file.data,
            Key: path.join(prefix, file.name),
          },
        }).done()
      );
    }

    return fileResults;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
}

export async function deleteItems(keysCommaSeparated: string) {
  try {
    const keys = keysCommaSeparated.split(',');

    const deleteResults = [];

    for await (const key of keys) {
      const result = await s3.deleteObject({ ...bucketParams, Key: key });
      deleteResults.push(result);
    }

    return deleteResults;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
}
