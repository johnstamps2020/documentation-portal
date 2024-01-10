import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useVersions } from '../../../hooks/useApi';
import DuplicateButton from './DuplicateButton';
import VersionCardContents from './VersionCardContents';
import VersionSettingsForm from './VersionSettingsForm';

export default function VersionAdminPanel() {
  const { versions, isLoading, isError } = useVersions();

  if (isError || isLoading || !versions) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="Version"
      entityDatabaseName="Version"
      entityPrimaryKeyName="name"
      entities={versions.map(({ name, ...rest }) => ({
        label: name,
        name: name,
        ...rest,
      }))}
      DuplicateButton={DuplicateButton}
      FormComponent={VersionSettingsForm}
      EntityCardContents={VersionCardContents}
    />
  );
}
