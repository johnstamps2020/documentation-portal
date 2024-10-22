import { readFileSync } from 'fs';

const changedFilesEnvName = process.argv[2];
const teamcityChangedFilesPath = process.env.TEAMCITY_BUILD_CHANGEDFILES_FILE;
const teamcityTriggeredBy = process.env.TEAMCITY_BUILD_TIGGEREDBY;
console.log({
  changedFilesEnvName,
  teamcityChangedFilesPath,
  teamcityTriggeredBy,
});

function getOtherListsOfChangedFiles() {
  const otherPathSetInEnv = new Set();

  Object.entries(process.env).forEach(([key, value]) => {
    if (key.includes(changedFilesEnvName.split('.')[1]) && value.length > 0) {
      value.split(',').forEach((path) => otherPathSetInEnv.add(path));
    }
  });

  if (otherPathSetInEnv.size > 0) {
    return Array.from(otherPathSetInEnv).join(',');
  }

  console.log('No OTHER paths set in the environment');
  return undefined;
}

function getChangedFilesEnvValue() {
  try {
    const changedFilesEnvValue = process.env[changedFilesEnvName.split('.')[1]];
    console.log(
      `In this build, ${changedFilesEnvName}: ${
        changedFilesEnvValue || 'THIS VALUE IS INTENTIONALLY LEFT EMPTY'
      }`
    );

    if (changedFilesEnvValue && changedFilesEnvValue.length > 0) {
      return changedFilesEnvValue;
    }

    const otherListOfChangedFiles = getOtherListsOfChangedFiles();
    if (otherListOfChangedFiles) {
      console.log(
        `Setting list of files from upstream builds: "${otherListOfChangedFiles}"`
      );
      return otherListOfChangedFiles;
    }

    if (teamcityTriggeredBy.includes('Git')) {
      const result = readFileSync(teamcityChangedFilesPath, {
        encoding: 'utf8',
      })
        .split('\n')
        .map((line) => line.trim().split(':')[0])
        .join(',');
      console.log('Setting value for Git, listing changed files', result);
      return result;
    }
    console.log(
      'Setting value from pre-configured triggers',
      process.env.ALL_TRIGGER_PATHS
    );
    return process.env.ALL_TRIGGER_PATHS;
  } catch (e) {
    console.error('ERROR when getting list of trigger paths to export', e);
    process.exit(1);
  }
}

// This console log actually set a Teamcity parameter to make it available to other steps
console.log(
  `##teamcity[setParameter name='${changedFilesEnvName}' value='${getChangedFilesEnvValue()}']`
);
