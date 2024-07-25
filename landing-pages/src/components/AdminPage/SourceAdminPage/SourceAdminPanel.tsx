import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useSources } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import SourceCardContents from './SourceCardContents';
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
      entities={sources}
      DuplicateButton={DuplicateButton}
      FormComponent={SourceSettingsForm}
      EntityCardContents={SourceCardContents}
    />
  );
}
