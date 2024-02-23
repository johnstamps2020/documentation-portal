import { existsSync, mkdirSync, rmdirSync, writeFileSync } from 'fs';
import { getDocInfoByDocId } from '../modules/databaseOperations';
import { exec, spawn } from 'child_process';

const outputRoot = process.argv[3];

if (!outputRoot) {
  console.error(
    'Please provide a root folder to work in as the second argument'
  );
  process.exit(1);
}

const buildDir = `${outputRoot}/_builds`;
const cloneDir = `${outputRoot}/_clones`;

[buildDir, cloneDir].forEach((directory) => {
  if (existsSync(directory)) {
    console.log(`Removing ${directory}`);
    rmdirSync(directory, { recursive: true });
  }

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
});

async function createDitaBuildInfo(config: any, docId: string) {
  console.log('Creating a DITA build info...');

  const { root, filter } = config;
  const buildInfo = { root, filter };

  const outputFilePath = `${buildDir}/${docId}.json`;
  writeFileSync(outputFilePath, JSON.stringify(buildInfo, null, 2));

  console.log(`Build file saved to ${outputFilePath}`);
}

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

async function createDitaTranslationKit() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('Please provide a document id as the first argument');
    process.exit(1);
  }

  const docInfo = await getDocInfoByDocId(docId);

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

  createDitaBuildInfo(docInfo.build, docId);
}

createDitaTranslationKit();
