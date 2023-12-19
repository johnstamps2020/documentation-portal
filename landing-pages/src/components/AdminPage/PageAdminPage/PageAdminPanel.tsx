import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { usePages } from '../../../hooks/useApi';
import DuplicateButton from './DuplicateButton';
import FileValidationWarning, {
  checkIfFileExists,
} from './PageValidationWarning';
import PageSettingsForm from './PageSettingsForm';
import PageCardContents from './PageCardContents';

export default function PageAdminPanel() {
  const { pages, isLoading, isError } = usePages();

  if (isError || isLoading || !pages) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="page"
      entityDatabaseName="Page"
      entityPrimaryKeyName="path"
      entities={pages.map(({ title, ...rest }) => ({
        label: title,
        ...rest,
      }))}
      DuplicateButton={DuplicateButton}
      FormComponent={PageSettingsForm}
      EntityCardContents={PageCardContents}
      CardWarning={FileValidationWarning}
      additionalFilters={[
        {
          filterId: 'missingFileInLandingPages',
          emptyFilterValue: false,
          filterFunction: checkIfFileExists,
        },
      ]}
    />
  );
}
