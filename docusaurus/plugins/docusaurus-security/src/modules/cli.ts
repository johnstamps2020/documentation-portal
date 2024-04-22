import { renameFiles } from './renameFiles';
import { runCommand } from './runCommand';
import { revertFileChanges } from './postBuild';

export async function buildVariants() {
  console.log('Building the restricted variant...');
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__restricted'],
    'RESTRICTED BUILD',
    {
      PUBLIC: 'false',
    }
  );

  console.log('Building the public variant...');
  renameFiles();
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__public'],
    'PUBLIC BUILD',
    {
      PUBLIC: 'true',
    }
  );
  revertFileChanges();
}

export async function buildDefault() {
  console.log('Building the default variant...');
  await runCommand('docusaurus', ['build'], 'DEFAULT BUILD');
}
