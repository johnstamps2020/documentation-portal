const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const bucketParams = {
  Bucket: `tenant-doctools-${process.env.DEPLOY_ENV}-builds`,
};

async function listItems(prefix) {
  try {
    return s3.listObjects({ ...bucketParams, Prefix: prefix }).promise();
  } catch (err) {
    throw new Error(err);
  }
}

async function addItems(filesFromClient, prefix) {
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
        await s3
          .upload({
            ...bucketParams,
            Body: file.data,
            Key: path.join(prefix, file.name),
          })
          .promise()
      );
    }

    return fileResults;
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteItems(keysCommaSeparated) {
  try {
    const keys = keysCommaSeparated.split(',');

    const deleteResults = [];

    for await (const key of keys) {
      const result = await s3
        .deleteObject({ ...bucketParams, Key: key })
        .promise();
      deleteResults.push(result);
    }

    return deleteResults;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { listItems, addItems, deleteItems };
