import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useResources } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ResourceCardContents from './ResourceCardContents';
import ResourceSettingsForm from './ResourceSettingsForm';

export default function ResourceAdminPanel() {
  const { resources, isLoading, isError } = useResources();

  if (isError || isLoading || !resources) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="resource"
      entityDatabaseName="Resource"
      entityPrimaryKeyName="id"
      entities={resources.map(({ id, ...rest }) => ({
        label: id,
        id: id,
        ...rest,
      }))}
      DuplicateButton={DuplicateButton}
      FormComponent={ResourceSettingsForm}
      EntityCardContents={ResourceCardContents}
    />
  );
}
