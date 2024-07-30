import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useReleases } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ReleaseCardContents from './ReleaseCardContents';
import ReleaseSettingsForm from './ReleaseSettingsForm';
import AddButton from '../AddButton';

export default function ReleaseAdminPanel() {
  const { releases, isLoading, isError } = useReleases();

  if (isError || isLoading || !releases) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add release"
        dialogTitle="Create a new release"
        formComponent={<ReleaseSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="release"
        entityDatabaseName="Release"
        entityPrimaryKeyName="name"
        entities={releases}
        DuplicateButton={DuplicateButton}
        FormComponent={ReleaseSettingsForm}
        EntityCardContents={ReleaseCardContents}
        disabled={disabled}
      />
    </>
  );
}
