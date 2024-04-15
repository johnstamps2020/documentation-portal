import chalk from 'chalk';
import { runCommand } from './runCommand';

export async function buildVariants() {
  console.log(chalk.blueBright('Building the restricted variant...'));
  await runCommand(
    'docusaurus',
    ['build', '--out-dir', 'build/__restricted'],
    'PUBLIC BUILD',
    {
      RESTRICTED: 'true',
    }
  );

  console.log(chalk.blueBright('Building the public variant...'));
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
  console.log(chalk.blueBright('Building the default variant...'));
  await runCommand('docusaurus', ['build'], 'DEFAULT BUILD');
}
