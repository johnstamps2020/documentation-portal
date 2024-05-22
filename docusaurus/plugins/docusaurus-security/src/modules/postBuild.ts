import { existsSync, readFileSync, renameSync, rmSync } from 'fs';
import { RenameRestoreItem, renameRestoreListFilePath } from './renameFiles';

export function revertFileChanges(): void {
  if (!existsSync(renameRestoreListFilePath)) {
    return;
  }

  console.log('Reverting file changes');

  const renameRestoreList = JSON.parse(
    readFileSync(renameRestoreListFilePath, 'utf-8')
  ) as RenameRestoreItem[];

  for (const { oldPath, newPath } of renameRestoreList) {
    if (!existsSync(newPath)) {
      console.error('Cannot restore file name', newPath, 'file does not exist');
    }

    rmSync(oldPath);
    renameSync(newPath, oldPath);
    console.log('Renamed file back from', newPath, 'to', oldPath);
  }

  console.log('Deleting the temporary rename list');
  rmSync(renameRestoreListFilePath);
}
