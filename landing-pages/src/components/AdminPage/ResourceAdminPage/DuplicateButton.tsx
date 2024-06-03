import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useResourceData } from 'hooks/useEntitiesData';
import { Resource } from '@doctools/components';
import ResourceSettingsForm from './ResourceSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, resourceData } = useResourceData(primaryKey);

  if (isError || isLoading || !resourceData) {
    return null;
  }

  function getResourceDataWithoutUuid(resourceData: Resource) {
    const { uuid, ...rest } = resourceData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate resource"
      dialogTitle="Duplicate resource"
      leftFormTitle="Source resource"
      leftFormComponent={
        <ResourceSettingsForm
          initialResourceData={getResourceDataWithoutUuid(resourceData)}
          disabled
        />
      }
      rightFormTitle="New resource"
      rightFormComponent={
        <ResourceSettingsForm
          initialResourceData={getResourceDataWithoutUuid(resourceData)}
        />
      }
    />
  );
}
