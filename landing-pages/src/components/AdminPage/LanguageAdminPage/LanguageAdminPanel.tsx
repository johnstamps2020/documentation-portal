import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useLanguages } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import LanguageCardContents from './LanguageCardContents';
import LanguageSettingsForm from './LanguageSettingsForm';
import AddButton from '../AddButton';

export default function LanguageAdminPanel() {
  const { languages, isLoading, isError } = useLanguages();

  if (isError || isLoading || !languages) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add language"
        dialogTitle="Create a new language"
        formComponent={<LanguageSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="language"
        entityDatabaseName="Language"
        entityPrimaryKeyName="code"
        entities={languages}
        DuplicateButton={DuplicateButton}
        FormComponent={LanguageSettingsForm}
        EntityCardContents={LanguageCardContents}
        disabled={disabled}
      />
    </>
  );
}
