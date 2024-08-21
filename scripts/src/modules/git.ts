import { DocInfo } from './database';
import { runInOs } from './os';

export async function cloneRepositoryForDoc(
  docInfo: DocInfo,
  cloneDir: string
) {
  const { gitUrl, gitBranch } = docInfo.source;

  const gitHubServiceAccountUsername =
    process.env.GITHUB_SERVICE_ACCOUNT_USERNAME;
  const gitHubServiceAccountPersonalAccessToken =
    process.env.GITHUB_SERVICE_ACCOUNT_PERSONAL_ACCESS_TOKEN;
  const gitUrlWithCredentials = gitUrl.replace(
    'github.com/',
    `${gitHubServiceAccountUsername}:${gitHubServiceAccountPersonalAccessToken}@github.com/`
  );

  const gitCommand = `git`;
  const gitArgs = [
    'clone',
    '--single-branch',
    '--branch',
    gitBranch,
    gitUrl.includes('github.com') ? gitUrlWithCredentials : gitUrl,
    cloneDir,
    '--recurse-submodules',
  ];

  // clone
  console.log(`Cloning ${gitUrl}...`);
  console.log(`${gitCommand} ${gitArgs.join(' ')}`);
  try {
    await runInOs(gitCommand, gitArgs, 'git clone');
  } catch (err) {
    console.error('Failed to clone repository, QUITTING!');
    process.exit(1);
  }

  // log success from stdout
  console.log('Successfully cloned repository');
}
