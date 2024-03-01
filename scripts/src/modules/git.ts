import { DocInfo } from './database';
import { runInOs } from './os';

export async function cloneRepositoryForDoc(
  docInfo: DocInfo,
  cloneDir: string
) {
  // verify SHH key
  await runInOs('ssh', ['-v', 'git@stash.guidewire.com'], 'SSH Key');

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
