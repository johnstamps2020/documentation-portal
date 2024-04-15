import { runCommand } from './runCommand';

export async function buildVariants() {
  console.log('Building the restricted variant...');
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__restricted'],
    'PUBLIC BUILD',
    {
      RESTRICTED: 'true',
    }
  );

  console.log('Building the public variant...');
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__public'],
    'RESTRICTED BUILD',
    {
      RESTRICTED: 'false',
    }
  );
}

export async function buildDefault() {
  console.log('Building the default variant...');
  await runCommand('docusaurus', ['build'], 'DEFAULT BUILD');
}
