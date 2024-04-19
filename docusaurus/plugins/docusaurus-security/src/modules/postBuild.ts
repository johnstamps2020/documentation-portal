import { existsSync, readFileSync, renameSync, rmSync } from 'fs';
import { RenameRestoreItem, renameRestoreListFilePath } from './filterSidebars';
import { isPublicBuild } from './helpers';

export function revertFileChanges(): void {
  if (!isPublicBuild() || !existsSync(renameRestoreListFilePath)) {
    return;
  }

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
