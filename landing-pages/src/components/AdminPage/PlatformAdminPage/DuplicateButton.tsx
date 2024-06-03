import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { usePlatformData } from 'hooks/useEntitiesData';
import { Platform } from '@doctools/components';
import PlatformSettingsForm from './PlatformSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, platformData } = usePlatformData(primaryKey);

  if (isError || isLoading || !platformData) {
    return null;
  }

  function getPlatformDataWithoutUuid(platformData: Platform) {
    const { uuid, ...rest } = platformData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate platform"
      dialogTitle="Duplicate platform"
      leftFormTitle="Source platform"
      leftFormComponent={
        <PlatformSettingsForm
          initialPlatformData={getPlatformDataWithoutUuid(platformData)}
          disabled
        />
      }
      rightFormTitle="New platform"
      rightFormComponent={
        <PlatformSettingsForm
          initialPlatformData={getPlatformDataWithoutUuid(platformData)}
        />
      }
    />
  );
}
