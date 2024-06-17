import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useExternalLinkData } from 'hooks/useEntitiesData';
import { ExternalLink } from '@doctools/server';
import ExternalLinkSettingsForm from './ExternalLinkSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, externalLinkData } =
    useExternalLinkData(primaryKey);

  if (isError || isLoading || !externalLinkData) {
    return null;
  }

  function getExternalLinkDataWithoutUuid(externalLinkData: ExternalLink) {
    const { uuid, ...rest } = externalLinkData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate external link"
      dialogTitle="Duplicate external link"
      leftFormTitle="Source external link"
      leftFormComponent={
        <ExternalLinkSettingsForm
          initialExternalLinkData={getExternalLinkDataWithoutUuid(
            externalLinkData
          )}
          disabled
        />
      }
      rightFormTitle="New external link"
      rightFormComponent={
        <ExternalLinkSettingsForm
          initialExternalLinkData={getExternalLinkDataWithoutUuid(
            externalLinkData
          )}
        />
      }
    />
  );
}
