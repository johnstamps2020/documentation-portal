import { Source } from '@doctools/server';
import { getAccessToken } from '../modules/auth';
import { getAllEntities } from '../modules/database';
import fs from 'fs';
import path from 'path';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const env = 'staging';

interface ParsedArguments {
  workingDir: string;
  generateMd: boolean;
  _: (string | number)[];
  $0: string;
}

async function updateSourceConfigs() {
  const argv: ParsedArguments = parseArgs();
  const accessToken = await getAccessToken(env);

  createDir(argv.workingDir);
  process.chdir(argv.workingDir);
  try {
    const sources: Source[] | undefined = await getSources(accessToken);

    if (!sources) {
      console.error('Error retrieving sources');
      return;
    }

    const groupedSources = groupSourcesByGitUrl(sources);
    saveSourcesToFile(groupedSources, argv.workingDir);
    argv.generateMd && generateMarkdownFile(sources, argv.workingDir);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`An error occurred: ${err.message}`);
    } else {
      console.error('Unknown error occurred');
    }
  }
}

async function getSources(accessToken: string): Promise<Source[] | undefined> {
  try {
    const sources: Source[] | undefined = await getAllEntities(
      'Source',
      env,
      accessToken
    );
    return sources;
  } catch (err) {
    console.error(err);
  }
}

function groupSourcesByGitUrl(sources: Source[]): Map<string, Source[]> {
  const groupedSources = new Map<string, Source[]>();
  sources.forEach((source) => {
    const repoName = getRepoNameFromUrl(source.gitUrl);
    if (!groupedSources.has(repoName)) {
      groupedSources.set(repoName, []);
    }
    groupedSources.get(repoName)?.push(source);
  });
  return groupedSources;
}

function saveSourcesToFile(
  groupedSources: Map<string, Source[]>,
  workingDir: string
) {
  groupedSources.forEach((sources, repoName) => {
    let fileName = repoName;
    const sortedSources = sources.sort((a, b) =>
      a.gitBranch.localeCompare(b.gitBranch)
    );
    const strippedSources = sortedSources.map((source) => ({
      id: source.id,
      title: source.name,
      gitUrl: source.gitUrl,
      branch: source.gitBranch,
    }));

    const output = {
      $schema:
        'https://docs.staging.ccs.guidewire.net/schemas/doc-portal/config-schema.json',
      sources: strippedSources,
    };

    if (repoName.startsWith('docsources-')) {
      fileName = repoName.replace(/^docsources-/, '');
    }

    const filePath = path.join(workingDir, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`Saved ${sources.length} sources to ${filePath}`);
  });
}

function generateMarkdownFile(sources: Source[], workingDir: string): void {
  const markdownFilePath = path.join(workingDir, '_repositories.md');

  // Group sources by gitUrl and filter those that contain 'stash'
  const groupedSources = groupSourcesByGitUrl(sources);
  const stashGroupedSources = new Map<string, Source[]>();

  // Filter for 'stash' repositories only
  groupedSources.forEach((sources, repoName) => {
    const gitUrl = sources[0].gitUrl;
    if (gitUrl.includes('stash')) {
      stashGroupedSources.set(repoName, sources);
    }
  });

  // Prepare markdown content
  let markdownContent = `# Repositories\n\n`;
  markdownContent +=
    '| Repo name | Owner | Start date | Freeze | Dry-run | Migration | Permissions | Submodules | Finish date |\n';
  markdownContent +=
    '|-----------|-------|------------|--------|---------|-----------|-------------|------------|-------------|\n';

  stashGroupedSources.forEach((sources, repoName) => {
    markdownContent += `| ${repoName} | | | | | | | | |\n`; // Only populate Repo name
  });

  // Write the markdown content to a file
  fs.writeFileSync(markdownFilePath, markdownContent, 'utf-8');
  console.log(`Markdown file generated at: ${markdownFilePath}`);
}

function parseArgs(): ParsedArguments {
  return yargs(hideBin(process.argv))
    .version(false)
    .option('workingDir', {
      alias: 'wd',
      type: 'string',
      default: process.cwd() + '/../../tmp-src-configs',
      description: 'Working directory that will contain source config files.',
    })
    .option('generateMd', {
      alias: 'md',
      type: 'boolean',
      default: false,
      description:
        'Set to true to also generate a MD file with a table of sources for migration tracking.',
    })
    .help().argv as ParsedArguments;
}

function createDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

function getRepoNameFromUrl(url: string): string {
  const lastPart = url.split(/[:/]/).pop() || '';
  const repoName = lastPart.endsWith('.git') ? lastPart.slice(0, -4) : lastPart;

  return repoName;
}

updateSourceConfigs();
