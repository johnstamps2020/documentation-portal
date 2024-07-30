import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { usePages } from '../../../hooks/useApi';
import DuplicateButton from './DuplicateButton';
import FileValidationWarning, {
  checkIfFileExists,
} from './PageValidationWarning';
import PageSettingsForm from './PageSettingsForm';
import PageCardContents from './PageCardContents';
import AddButton from '../AddButton';

export default function PageAdminPanel() {
  const { pages, isLoading, isError } = usePages();

  if (isError || isLoading || !pages) {
    return null;
  }

  const disabled = false;

  return (
    <>
      <AddButton
        buttonLabel="Add page"
        dialogTitle="Create a new page"
        formComponent={<PageSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="page"
        entityDatabaseName="Page"
        entityPrimaryKeyName="path"
        entities={pages}
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
        disabled={disabled}
      />
    </>
  );
}
