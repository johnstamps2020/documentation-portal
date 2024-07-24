import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useReleases } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ReleaseCardContents from './ReleaseCardContents';
import ReleaseSettingsForm from './ReleaseSettingsForm';

export default function ReleaseAdminPanel() {
  const { releases, isLoading, isError } = useReleases();

  if (isError || isLoading || !releases) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="release"
      entityDatabaseName="Release"
      entityPrimaryKeyName="name"
      entities={releases.sort((a, b) => a.name.localeCompare(b.name))}
      DuplicateButton={DuplicateButton}
      FormComponent={ReleaseSettingsForm}
      EntityCardContents={ReleaseCardContents}
    />
  );
}
