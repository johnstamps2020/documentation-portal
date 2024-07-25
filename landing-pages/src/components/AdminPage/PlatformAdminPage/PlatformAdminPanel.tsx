import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { usePlatforms } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import PlatformCardContents from './PlatformCardContents';
import PlatformSettingsForm from './PlatformSettingsForm';

export default function PlatformAdminPanel() {
  const { platforms, isLoading, isError } = usePlatforms();

  if (isError || isLoading || !platforms) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="platform"
      entityDatabaseName="Platform"
      entityPrimaryKeyName="name"
      entities={platforms}
      DuplicateButton={DuplicateButton}
      FormComponent={PlatformSettingsForm}
      EntityCardContents={PlatformCardContents}
    />
  );
}
