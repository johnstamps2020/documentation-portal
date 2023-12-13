import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useSourceData } from 'hooks/useEntitiesData';
import { Source } from 'server/dist/model/entity/Source';
import SourceSettingsForm from './SourceSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, sourceData } = useSourceData(primaryKey);

  if (isError || isLoading || !sourceData) {
    return null;
  }

  function getSourceDataWithoutUuid(sourceData: Source) {
    const { uuid, ...rest } = sourceData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate source"
      dialogTitle="Duplicate source"
      leftFormTitle="Source source"
      leftFormComponent={
        <SourceSettingsForm
          initialSourceData={getSourceDataWithoutUuid(sourceData)}
          disabled
        />
      }
      rightFormTitle="New source"
      rightFormComponent={
        <SourceSettingsForm
          initialSourceData={getSourceDataWithoutUuid(sourceData)}
        />
      }
    />
  );
}
