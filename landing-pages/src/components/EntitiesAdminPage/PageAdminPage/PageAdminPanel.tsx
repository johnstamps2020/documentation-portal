import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { usePages } from '../../../hooks/useApi';
import DeleteButton from './DeleteButton';
import DuplicateButton from './DuplicateButton';
import PageSettingsForm from './PageSettingsForm';

export default function PageAdminPanel() {
  const { pages, isLoading, isError } = usePages();

  if (isError || isLoading || !pages) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="page"
      entityDatabaseName="Page"
      entityPrimaryKeyName='path'
      entities={pages.map(({ title, path, ...rest }) => ({
        label: title,
        url: path,
        ...rest,
      }))}
      DeleteButton={DeleteButton}
      DuplicateButton={DuplicateButton}
      FormComponent={PageSettingsForm}
    />
  );
}
