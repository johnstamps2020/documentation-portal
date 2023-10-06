import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useExternalLinks } from '../../../hooks/useApi';
import DeleteButton from './DeleteButton';
import DuplicateButton from './DuplicateButton';
import ExternalLinkSettingsForm from './ExternalLinkSettingsForm';

export default function ExternalLinkAdminPanel() {
  const { externalLinks, isLoading, isError } = useExternalLinks();

  if (isError || isLoading || !externalLinks) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="external link"
      entities={externalLinks.map(({ label, ...rest }) => ({ label, ...rest }))}
      DeleteButton={DeleteButton}
      DuplicateButton={DuplicateButton}
      FormComponent={ExternalLinkSettingsForm}
    />
  );
}
