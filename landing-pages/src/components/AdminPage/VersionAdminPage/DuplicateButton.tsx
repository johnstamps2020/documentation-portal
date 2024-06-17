import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useVersionData } from 'hooks/useEntitiesData';
import { Version } from '@doctools/server';
import VersionSettingsForm from './VersionSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, versionData } = useVersionData(primaryKey);

  if (isError || isLoading || !versionData) {
    return null;
  }

  function getVersionDataWithoutUuid(versionData: Version) {
    const { uuid, ...rest } = versionData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate version"
      dialogTitle="Duplicate version"
      leftFormTitle="Source version"
      leftFormComponent={
        <VersionSettingsForm
          initialVersionData={getVersionDataWithoutUuid(versionData)}
          disabled
        />
      }
      rightFormTitle="New version"
      rightFormComponent={
        <VersionSettingsForm
          initialVersionData={getVersionDataWithoutUuid(versionData)}
        />
      }
    />
  );
}
