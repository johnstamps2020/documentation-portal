import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useVersions } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import VersionCardContents from './VersionCardContents';
import VersionSettingsForm from './VersionSettingsForm';
import AddButton from '../AddButton';

export default function VersionAdminPanel() {
  const { versions, isLoading, isError } = useVersions();

  if (isError || isLoading || !versions) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add version"
        dialogTitle="Create a new version"
        formComponent={<VersionSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="Version"
        entityDatabaseName="Version"
        entityPrimaryKeyName="name"
        entities={versions}
        DuplicateButton={DuplicateButton}
        FormComponent={VersionSettingsForm}
        EntityCardContents={VersionCardContents}
        disabled={disabled}
      />
    </>
  );
}
