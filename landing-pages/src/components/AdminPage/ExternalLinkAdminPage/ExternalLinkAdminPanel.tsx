import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useExternalLinks } from '@doctools/server';
import DuplicateButton from './DuplicateButton';
import ExternalLinkCardContents from './ExternalLinkCardContents';
import ExternalLinkSettingsForm from './ExternalLinkSettingsForm';

export default function ExternalLinkAdminPanel() {
  const { externalLinks, isLoading, isError } = useExternalLinks();

  if (isError || isLoading || !externalLinks) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="external link"
      entityDatabaseName="ExternalLink"
      entityPrimaryKeyName="url"
      entities={externalLinks}
      DuplicateButton={DuplicateButton}
      FormComponent={ExternalLinkSettingsForm}
      EntityCardContents={ExternalLinkCardContents}
    />
  );
}
