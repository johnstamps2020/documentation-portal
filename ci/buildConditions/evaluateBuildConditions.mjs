import { readFileSync } from 'fs';

const changedFilesEnvName = process.argv[2];
const teamcityChangedFilesPath = process.env.TEAMCITY_BUILD_CHANGEDFILES_FILE;
const teamcityTriggeredBy = process.env.TEAMCITY_BUILD_TIGGEREDBY;

function getChangedFilesEnvValue() {
  try {
    if (teamcityTriggeredBy.includes('Git')) {
      return readFileSync(teamcityChangedFilesPath, {
        encoding: 'utf8',
      })
        .split('\n')
        .map((line) => line.trim().split(':')[0])
        .join(',');
    }
    return process.env.ALL_TRIGGER_PATHS;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

console.log(
  `##teamcity[setParameter name='${changedFilesEnvName}' value='${getChangedFilesEnvValue()}']`
);
