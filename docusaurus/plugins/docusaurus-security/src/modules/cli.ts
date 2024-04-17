import { runCommand } from './runCommand';

export async function buildVariants() {
  console.log('Building the restricted variant...');
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__restricted'],
    'RESTRICTED BUILD',
    {
      RESTRICTED: 'false',
    }
  );

  console.log('Building the public variant...');
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__public'],
    'PUBLIC BUILD',
    {
      RESTRICTED: 'true',
    }
  );
}

export async function buildDefault() {
  console.log('Building the default variant...');
  await runCommand('docusaurus', ['build'], 'DEFAULT BUILD', {
    RESTRICTED: 'false',
  });
}
