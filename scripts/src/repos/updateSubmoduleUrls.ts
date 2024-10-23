import { DitaBuild, Source } from '@doctools/server';
import { getAccessToken } from '../modules/auth';
import {
  getEntitiesByAttribute,
  getEntityByAttribute,
} from '../modules/database';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const env = 'staging';

interface ParsedArguments {
  workingDir: string;
  gitUrl: string;
  _: (string | number)[];
  $0: string;
}

async function updateSubmoduleUrls() {
  const argv: ParsedArguments = parseArgs();
  const accessToken = await getAccessToken(env);

  createDir(argv.workingDir);
  const sources: Source[] = [];
  try {
    const ditaBuildSources = await getDitaBuildSources(
      argv.gitUrl,
      accessToken
    );

    if (!ditaBuildSources) {
      console.error('Error retrieving sources');
      return;
    }

    const repoDir = join(argv.workingDir, getRepoNameFromUrl(argv.gitUrl));
    if (!existsSync(repoDir)) {
      console.log(`Cloning ${argv.gitUrl} into ${repoDir}`);
      try {
        execSync(`git clone ${argv.gitUrl} ${repoDir}`, { stdio: 'inherit' });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed to clone repo: ${error.message}`);
        } else console.error('Unknown error during git clone');
      }
    } else {
      console.log(`Repository ${repoDir} already exists. Skipping creation.`);
    }
    process.chdir(repoDir);

    for (const src of ditaBuildSources) {
      // Checkout the branch
      if (src.gitBranch) {
        try {
          try {
            console.log('');
            console.log(`Checking out source branch ${src.gitBranch}.`);
            execSync(`git checkout ${src.gitBranch}`, { stdio: 'inherit' });
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(
                `Failed to checkout branch ${src.gitBranch}: ${error.message}`
              );
            } else
              console.error(
                `Unknown error checking out branch ${src.gitBranch}`
              );
          }

          const gitmodulesPath = join(repoDir, '.gitmodules');
          if (existsSync(gitmodulesPath)) {
            console.log(
              'Submodules found. Checking and updating submodule URLs...'
            );

            const gitmodulesContent = readFileSync(gitmodulesPath, 'utf-8');
            const submoduleRegex =
              /\[submodule "([^"]+)"\]\s*path = ([^\s]+)\s*url = ([^\s]+)/g;
            let match;
            let updateMade = false;
            while ((match = submoduleRegex.exec(gitmodulesContent)) !== null) {
              const submoduleName = match[1];
              const submodulePath = match[2];
              const submoduleUrl = match[3];

              if (submoduleUrl.includes('github.com')) {
                console.log(
                  `Skipping update for submodule ${submoduleName} as it already contains 'github.com'`
                );
                continue;
              }

              const newUrl = `https://github.com/gwre-pdo/docsources-${submodulePath}.git`;

              console.log(
                `Setting new URL for submodule ${submoduleName} (${submodulePath}) to ${newUrl}`
              );
              execSync(`git submodule set-url ${submodulePath} ${newUrl}`, {
                stdio: 'inherit',
              });
              updateMade = true;
            }
            if (updateMade) {
              execSync('git add -A', { stdio: 'inherit' });
              try {
                const changes = execSync('git status --porcelain')
                  .toString()
                  .trim();
                if (changes) {
                  execSync('git commit -m "Update submodule URLs"', {
                    stdio: 'inherit',
                  });
                } else {
                  console.log('No changes to commit.');
                }
              } catch (error: unknown) {
                if (error instanceof Error) {
                  console.error(`Failed to commit changes: ${error.message}`);
                }
              }

              execSync('git push', { stdio: 'inherit' });
            } else {
              console.log('No updates were made to submodule URLs.');
            }
          } else {
            console.log('No submodules found in this repository branch.');
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(
              `Failed to update submodule URLs or push changes: ${error.message}`
            );
          } else {
            console.error(
              'Unknown error occurred during git submodule operations'
            );
          }
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`An error occurred: ${err.message}`);
    } else {
      console.error('Unknown error occurred');
    }
  }
}

async function getDitaBuildSources(
  gitUrl: string,
  accessToken: string
): Promise<Source[] | undefined> {
  try {
    const sources: Source[] = [];
    let allSourcesForUrl: Source[] = await getEntitiesByAttribute(
      'Source',
      'gitUrl',
      gitUrl,
      env,
      accessToken,
      true
    );

    if (!allSourcesForUrl) {
      console.log(`No exact source matches for ${gitUrl}.`);
      const stashUrl = convertGitHubUrlToStash(gitUrl);
      console.log(`Trying to find matches for Stash equivalent ${stashUrl}.`);
      allSourcesForUrl = await getEntitiesByAttribute(
        'Source',
        'gitUrl',
        stashUrl,
        env,
        accessToken
      );
    }

    if (allSourcesForUrl.length > 0) {
      for (const src of allSourcesForUrl) {
        try {
          const buildResponse: DitaBuild[] | undefined =
            await getEntityByAttribute(
              'DitaBuild',
              'source[id]',
              src.id,
              env,
              accessToken,
              false
            );
          if (buildResponse !== undefined) {
            const exists = sources.some(
              (existingSrc) => existingSrc.id === src.id
            );

            if (!exists) {
              sources.push(src);
            }
          }
        } catch (err) {}
      }
      return sources;
    }
  } catch (err) {
    console.error(err);
  }
  return;
}

function parseArgs(): ParsedArguments {
  return yargs(hideBin(process.argv))
    .version(false)
    .option('workingDir', {
      alias: 'wd',
      type: 'string',
      default: process.cwd() + '/../../tmp',
      description: 'Working directory that will contain cloned repositories',
    })
    .option('gitUrl', {
      alias: 'url',
      type: 'string',
      required: true,
      description: 'Git URL',
    })
    .help().argv as ParsedArguments;
}

function convertGitHubUrlToStash(url: string): string {
  const match = url.match(/https:\/\/github\.com\/[^/]+\/([^/]+)\.git$/);

  if (!match) {
    throw new Error(
      'Invalid GitHub URL format. Expected format: https://github.com/gwre-pdo/project-reponame.git'
    );
  }

  const fullName = match[1];
  const [project, ...reponameParts] = fullName.split('-');
  const reponame = reponameParts.join('-'); // Join the rest back as the reponame
  const sshUrl = `ssh://git@stash.guidewire.com/${project}/${reponame}.git`;

  return sshUrl;
}

async function createDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
    console.log(`Directory already exists: ${dirPath}`);
  } catch (error) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    } catch (err) {
      console.error(`Error creating directory: ${err}`);
    }
  }
}

function getRepoNameFromUrl(url: string): string {
  const lastPart = url.split(/[:/]/).pop() || '';
  const repoName = lastPart.endsWith('.git') ? lastPart.slice(0, -4) : lastPart;

  return repoName;
}

updateSubmoduleUrls();
