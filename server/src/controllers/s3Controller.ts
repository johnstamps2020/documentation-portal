import { HeadObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import 'dotenv/config';
import { FileArray, UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { winstonLogger } from './loggerController';

const s3 = new S3({ apiVersion: '2006-03-01' });
const bucketParams = {
  Bucket: `tenant-doctools-${process.env.DEPLOY_ENV}-builds`,
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
            CacheControl: 'max-age=60',
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

function getFileExtension(str: string): string {
  const lastDotIndex = str.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }

  const extension = str.slice(lastDotIndex + 1);
  return extension;
}

// Return an S3 key from the URL passed
// 1. If the URL is to a page, return the key
// 2. If the URL is to a file, like .css, .js, .png, etc., return `undefined`
export function getS3KeyFromPathIfIsPage(path: string): string | undefined {
  const trimmedPath = path.replace(/^[\/]+|[\/]+$/g, '');

  if (trimmedPath.endsWith('.html') || trimmedPath.endsWith('.htm')) {
    return trimmedPath;
  }

  // is likely a file
  const extension = getFileExtension(trimmedPath);
  if (extension.length > 0 && extension.match(/[a-zA-Z]/)) {
    return undefined;
  }

  // Looking for a directory or a non-file path
  // So, add /index.html at the end
  return `${trimmedPath}/index.html`;
}

// This function only checks if pages exist
// If the requested URL is for a file, like .css, .js, .png, etc.
// Just optimistically assume it will be there
export async function pageExistsOnS3(url: string): Promise<boolean> {
  const keyToCheck = getS3KeyFromPathIfIsPage(url);

  // Path doesn't lead to a page, return `true`
  if (keyToCheck === undefined) {
    return true;
  }

  const bucketName = keyToCheck.startsWith('portal/secure')
    ? 'tenant-doctools-portal2-omega2-andromeda-builds'
    : bucketParams.Bucket;

  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: keyToCheck,
  });

  const s3Client = new S3Client();

  try {
    const result = await s3Client.send(command);
    if (result['$metadata'].httpStatusCode === 200) {
      return true;
    }
    return false;
  } catch (err: any) {
    winstonLogger.error(
      `[S3 CLIENT] Error checking if S3 bucket URL exists at ${keyToCheck}: ${err}`
    );
    return false;
  }
}
