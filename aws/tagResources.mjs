import fs from 'fs';
import { exec } from 'child_process';

// IMPORTANT: Log into the proper env through Atmos CLI before running this script

const resourceType = process.argv[2];
const awsEnv = process.argv[3];

function validateArgs() {
  const availableResourceTypes = ['ecr', 's3', 'secrets-manager'];
  const availableAwsEnvs = ['dev', 'prod'];
  if (
    !(
      availableResourceTypes.includes(resourceType) &&
      availableAwsEnvs.includes(awsEnv)
    )
  ) {
    throw new Error(`Invalid arguments. 
        Usage: node tagResource.mjs resourceType deployEnv
        Accepted resource types: ${availableResourceTypes.toString()}
        Accepted deploy envs: ${availableAwsEnvs.toString()}`);
  }
}

function loadAwsObjectsFromFile() {
  return JSON.parse(fs.readFileSync(`${resourceType}/${awsEnv}.json`, 'utf8'));
}

function mergeAndStringifyTags(tags) {
  const commonTags = JSON.parse(fs.readFileSync('common-tags.json', 'utf8'));
  const allTags = [...commonTags, ...tags];
  if (resourceType === 'ecr') {
    return allTags
      .map((obj) =>
        Object.entries(obj)
          .map(([key, value]) => `"${key}"="${value}"`)
          .join(',')
      )
      .join(' ');
  }
  return JSON.stringify(allTags);
}

function executeShellCmd(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error for command: ${cmd}\nError: ${error}`);
    } else if (stderr) {
      console.log(`Stderr: ${stderr}`);
    } else if (stdout) {
      console.log(stdout);
    }
  });
}

validateArgs();
console.log(`--- Applying tags for ${resourceType} on ${awsEnv} ---`);
const awsObjects = loadAwsObjectsFromFile();

if (resourceType === 'secrets-manager') {
  for (const secret of awsObjects) {
    const { secretId, tags } = secret;
    const awsConfigureTagsCmd = `aws secretsmanager tag-resource --secret-id ${secretId} --tags '${mergeAndStringifyTags(
      tags
    )}'`;
    const awsCheckTagsCmd = `aws secretsmanager describe-secret --secret-id ${secretId}`;
    executeShellCmd(awsConfigureTagsCmd);
    executeShellCmd(awsCheckTagsCmd);
  }
} else if (resourceType === 'ecr') {
  for (const repo of awsObjects) {
    const { resourceArn, tags } = repo;
    const awsConfigureTagsCmd = `aws ecr tag-resource --resource-arn "${resourceArn}" --tags ${mergeAndStringifyTags(
      tags
    )}`;
    const awsCheckTagsCmd = `aws ecr list-tags-for-resource --resource-arn "${resourceArn}" --no-paginate`;
    executeShellCmd(awsConfigureTagsCmd);
    executeShellCmd(awsCheckTagsCmd);
  }
} else if (resourceType === 's3') {
  for (const bucket of awsObjects) {
    const { bucketName, tags } = bucket;
    const awsConfigureTagsCmd = `aws s3api put-bucket-tagging --bucket "${bucketName}" --tagging '{"TagSet": ${mergeAndStringifyTags(
      tags
    )}}'`;
    const awsCheckTagsCmd = `aws s3api get-bucket-tagging --bucket "${bucketName}" --no-paginate --output json`;
    executeShellCmd(awsConfigureTagsCmd);
    executeShellCmd(awsCheckTagsCmd);
  }
}
