import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export async function createDitaBuildInfo(
  config: any,
  docId: string,
  targetDir: string
) {
  console.log('Creating a DITA build info...');

  const { root, filter } = config;
  const buildInfo = { root, filter };

  const outputFilePath = `${targetDir}/${docId}.json`;
  writeFileSync(outputFilePath, JSON.stringify(buildInfo, null, 2));

  console.log(`Build info saved to ${outputFilePath}`);
}

type BuildData = {
  git_url: string;
  git_branch: string;
  filter: string;
  resources: string[];
};

export async function copyFilesBasedOnBuildData(
  docUrl: string,
  cloneDir: string,
  targetDir: string
) {
  const buildDataUrl = `https://docportal-content.staging.ccs.guidewire.net/${docUrl}/build-data.json`;
  console.log(`Getting build info from ${buildDataUrl}`);
  const response = await fetch(buildDataUrl);

  if (!response.ok) {
    console.error(
      `Failed to get build data from ${buildDataUrl}, status code: ${response.status}`
    );
    process.exit(1);
  }

  const buildData: BuildData = await response.json();
  buildData.resources.forEach((resource) => {
    const decodedResource = decodeURIComponent(resource);
    const sourcePath = `${cloneDir}/${decodedResource}`;
    const targetPath = `${targetDir}/${decodedResource}`;
    console.log(`Copying ${sourcePath} to ${targetPath}`);

    const dirToCreate = dirname(targetPath);
    if (!existsSync(dirToCreate)) {
      mkdirSync(dirToCreate, { recursive: true });
    }

    copyFileSync(sourcePath, targetPath);
  });
}
