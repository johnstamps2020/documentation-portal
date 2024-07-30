import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { usePlatforms } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import PlatformCardContents from './PlatformCardContents';
import PlatformSettingsForm from './PlatformSettingsForm';
import AddButton from '../AddButton';

export default function PlatformAdminPanel() {
  const { platforms, isLoading, isError } = usePlatforms();

  if (isError || isLoading || !platforms) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add platform"
        dialogTitle="Create a new platform"
        formComponent={<PlatformSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="platform"
        entityDatabaseName="Platform"
        entityPrimaryKeyName="name"
        entities={platforms}
        DuplicateButton={DuplicateButton}
        FormComponent={PlatformSettingsForm}
        EntityCardContents={PlatformCardContents}
        disabled={disabled}
      />
    </>
  );
}
