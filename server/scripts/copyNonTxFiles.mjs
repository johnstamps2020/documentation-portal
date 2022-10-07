import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from 'fs';
import { basename, extname, join } from 'path';
import { cwd } from 'process';

const sourceDir = join(cwd(), 'src');

if (!existsSync(sourceDir)) {
  throw new Error(`Source directory does not exist: ${sourceDir}`);
}

function okayToCopy(fullPath) {
  if (['.ts', '.tsx', '.js', '.log'].includes(extname(fullPath))) {
    return false;
  }

  if (['.DS_Store'].includes(basename(fullPath))) {
    return false;
  }

  return true;
}

async function copyFilesConditionally(startingDir) {
  try {
    const fileList = readdirSync(startingDir);
    for await (const fileName of fileList) {
      const from = join(startingDir, fileName);
      if (lstatSync(from).isDirectory()) {
        copyFilesConditionally(from);
      } else {
        if (okayToCopy(from)) {
          const targetDir = startingDir.replace('/src/', '/dist/');
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
          }
          const to = join(targetDir, fileName);
          if (!existsSync(to)) {
            copyFileSync(from, to);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

copyFilesConditionally(sourceDir);
