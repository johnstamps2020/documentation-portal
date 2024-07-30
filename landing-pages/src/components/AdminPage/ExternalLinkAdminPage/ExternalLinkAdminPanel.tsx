import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useExternalLinks } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import ExternalLinkCardContents from './ExternalLinkCardContents';
import ExternalLinkSettingsForm from './ExternalLinkSettingsForm';
import AddButton from '../AddButton';

export default function ExternalLinkAdminPanel() {
  const { externalLinks, isLoading, isError } = useExternalLinks();

  if (isError || isLoading || !externalLinks) {
    return null;
  }

  const disabled = false;

  return (
    <>
      <AddButton
        buttonLabel="Add external link"
        dialogTitle="Create a new external link"
        formComponent={<ExternalLinkSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="external link"
        entityDatabaseName="ExternalLink"
        entityPrimaryKeyName="url"
        entities={externalLinks}
        DuplicateButton={DuplicateButton}
        FormComponent={ExternalLinkSettingsForm}
        EntityCardContents={ExternalLinkCardContents}
        disabled={disabled}
      />
    </>
  );
}
