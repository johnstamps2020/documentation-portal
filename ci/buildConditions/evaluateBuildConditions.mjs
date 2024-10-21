import { readFileSync } from 'fs';

const changedFilesEnvName = process.argv[2];
const teamcityChangedFilesPath = process.env.TEAMCITY_BUILD_CHANGEDFILES_FILE;
const teamcityTriggeredBy = process.env.TEAMCITY_BUILD_TIGGEREDBY;
console.log({
  changedFilesEnvName,
  teamcityChangedFilesPath,
  teamcityTriggeredBy,
});

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
