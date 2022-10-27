const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const bucketParams = {
  Bucket: `tenant-doctools-${process.env.DEPLOY_ENV}-builds`,
};

async function listItems(path) {
  try {
    const result = await s3
      .listObjects({ ...bucketParams, Prefix: path })
      .promise();
    return result;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { listItems };
