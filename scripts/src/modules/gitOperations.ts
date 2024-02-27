import { DocInfo } from './databaseOperations';
import { runInOs } from './osOperations';

export async function cloneRepositoryForDoc(
  docInfo: DocInfo,
  cloneDir: string
) {
  const { gitUrl, gitBranch } = docInfo.source;

  const gitCommand = `git`;
  const gitArgs = [
    'clone',
    '--single-branch',
    '--branch',
    gitBranch,
    gitUrl,
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
