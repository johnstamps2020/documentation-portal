import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useReleaseData } from 'hooks/useEntitiesData';
import { Release } from '@doctools/server';
import ReleaseSettingsForm from './ReleaseSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, releaseData } = useReleaseData(primaryKey);

  if (isError || isLoading || !releaseData) {
    return null;
  }

  function getReleaseDataWithoutUuid(releaseData: Release) {
    const { uuid, ...rest } = releaseData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate release"
      dialogTitle="Duplicate release"
      leftFormTitle="Source release"
      leftFormComponent={
        <ReleaseSettingsForm
          initialReleaseData={getReleaseDataWithoutUuid(releaseData)}
          disabled
        />
      }
      rightFormTitle="New release"
      rightFormComponent={
        <ReleaseSettingsForm
          initialReleaseData={getReleaseDataWithoutUuid(releaseData)}
        />
      }
    />
  );
}
