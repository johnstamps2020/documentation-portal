import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useSources } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import SourceCardContents from './SourceCardContents';
import SourceSettingsForm from './SourceSettingsForm';
import AddButton from '../AddButton';

export default function SourceAdminPanel() {
  const { sources, isLoading, isError } = useSources();

  if (isError || isLoading || !sources) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add source"
        dialogTitle="Create a new source"
        formComponent={<SourceSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="source"
        entityDatabaseName="Source"
        entityPrimaryKeyName="id"
        entities={sources}
        DuplicateButton={DuplicateButton}
        FormComponent={SourceSettingsForm}
        EntityCardContents={SourceCardContents}
        disabled={disabled}
      />
    </>
  );
}
