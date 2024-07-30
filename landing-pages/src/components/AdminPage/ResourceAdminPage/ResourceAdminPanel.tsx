import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useResources } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ResourceCardContents from './ResourceCardContents';
import ResourceSettingsForm from './ResourceSettingsForm';
import AddButton from '../AddButton';

export default function ResourceAdminPanel() {
  const { resources, isLoading, isError } = useResources();

  if (isError || isLoading || !resources) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add resource"
        dialogTitle="Create a new resource"
        formComponent={<ResourceSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="resource"
        entityDatabaseName="Resource"
        entityPrimaryKeyName="id"
        entities={resources}
        DuplicateButton={DuplicateButton}
        FormComponent={ResourceSettingsForm}
        EntityCardContents={ResourceCardContents}
        disabled={disabled}
      />
    </>
  );
}
