import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { checkIfFileExists } from 'components/EntitiesAdminPage/PageAdminPage/FileValidationWarning';
import { usePages } from '../../hooks/useApi';
import DeleteButton from '../EntitiesAdminPage/PageAdminPage/DeleteButton';
import DuplicateButton from '../EntitiesAdminPage/PageAdminPage/DuplicateButton';
import PageSettingsForm from '../EntitiesAdminPage/PageAdminPage/PageSettingsForm';

export default function FileValidatorPanel() {
  const { pages, isLoading, isError } = usePages();

  if (isError || isLoading || !pages) {
    return null;
  }

  const pagesWithoutFiles = pages.filter((page) => {
    if (!checkIfFileExists(page.path)) {
      return page;
    }
  });

  return (
    <EntityListWithFilters
      entityName="page"
      entities={pagesWithoutFiles.map(({ title, path, ...rest }) => ({
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
