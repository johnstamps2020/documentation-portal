import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useSources } from '../../../hooks/useApi';
import DeleteButton from './DeleteButton';
import DuplicateButton from './DuplicateButton';
import SourceSettingsForm from './SourceSettingsForm';

export default function SourceAdminPanel() {
  const { sources, isLoading, isError } = useSources();

  if (isError || isLoading || !sources) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="source"
      entityDatabaseName="Source"
      entityPrimaryKeyName="id"
      entities={sources.map(({ name, ...rest }) => ({
        label: name,
        ...rest,
      }))}
      DeleteButton={DeleteButton}
      DuplicateButton={DuplicateButton}
      FormComponent={SourceSettingsForm}
    />
  );
}
