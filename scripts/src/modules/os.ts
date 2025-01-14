import { spawn } from 'child_process';

export async function runInOs(
  command: string,
  commandLineArgs: string[],
  processLabel: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const cloneProcess = spawn(command, commandLineArgs, {
      stdio: 'inherit',
      shell: true,
    });

    cloneProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`${processLabel} CLOSE: Successfully cloned repository`);
        resolve();
      } else {
        console.error(`Failed to execute "${processLabel}" with code`, code);
        reject();
      }
    });

    cloneProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`${processLabel} EXIT: Successfully completed process`);
        resolve();
      } else {
        console.error(
          `Exited with code ${code} while running "${processLabel}"`
        );
        reject();
      }
    });

    cloneProcess.on('disconnect', () => {
      console.error(`Disconnected from the "${processLabel}" process`);
      reject();
    });

    cloneProcess.on('message', (message) => {
      console.log('MESSAGE', message);
    });
  });
}
