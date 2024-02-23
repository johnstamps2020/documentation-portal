import { spawn } from 'child_process';
import { DocInfo } from './databaseOperations';

async function clone(
  gitBranch: string,
  gitUrl: string,
  cloneDir: string
): Promise<void> {
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

  return new Promise<void>((resolve, reject) => {
    const cloneProcess = spawn(gitCommand, gitArgs);

    cloneProcess.stdout.on('data', (data) => {
      console.log('CLONE LOG:', data.toString());
    });

    cloneProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    cloneProcess.on('close', (code) => {
      if (code === 0) {
        console.log('PROCESS CLOSE: Successfully cloned repository');
        resolve();
      } else {
        console.error('Failed to clone repository with code', code);
        reject();
      }
    });

    cloneProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('PROCESS EXIT: Successfully cloned repository');
        resolve();
      } else {
        console.error('Failed to clone repository');
        reject();
      }
    });

    cloneProcess.on('disconnect', () => {
      console.error('Disconnected from clone process');
      reject();
    });

    cloneProcess.on('message', (message) => {
      console.log('MESSAGE', message);
    });
  });
}

export async function cloneRepositoryForDoc(
  docInfo: DocInfo,
  cloneDir: string
) {
  const { gitUrl, gitBranch } = docInfo.source;

  const gitCommand = `git clone --single-branch --branch ${gitBranch} ${gitUrl} ${cloneDir} --recurse-submodules  --progress --verbose`;

  // clone
  console.log(`Cloning ${gitUrl}...`);
  console.log(gitCommand);
  try {
    await clone(gitBranch, gitUrl, cloneDir);
  } catch (err) {
    console.error('Failed to clone repository, QUITTING!');
    process.exit(1);
  }

  // log success from stdout
  console.log('Successfully cloned repository');
}
