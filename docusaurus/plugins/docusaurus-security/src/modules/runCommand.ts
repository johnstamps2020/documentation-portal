import { spawn } from 'child_process';

function logTheCommand(
  command: string,
  commandLineArgs: string[],
  env?: { [key: string]: string }
) {
  const envString = env
    ? Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ')
    : '';
  console.log(envString, command, commandLineArgs.join(' '));
}

export async function runCommand(
  command: string,
  commandLineArgs: string[],
  processLabel: string,
  env?: { [key: string]: string }
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    logTheCommand(command, commandLineArgs, env);

    const spawnedProcess = spawn(command, commandLineArgs, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
      shell: true,
    });

    spawnedProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`${processLabel}: Successfully completed the process`);
        resolve();
      } else {
        console.error(`Failed to execute "${processLabel}" with code`, code);
        reject();
      }
    });

    spawnedProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`${processLabel} EXIT: Successfully exited the process`);
        resolve();
      } else {
        console.error(
          `Exited with code ${code} while running "${processLabel}"`
        );
        reject();
      }
    });

    spawnedProcess.on('disconnect', () => {
      console.error(`Disconnected from the "${processLabel}" process`);
      reject();
    });

    spawnedProcess.on('message', (message) => {
      console.log('MESSAGE', message);
    });
  });
}
