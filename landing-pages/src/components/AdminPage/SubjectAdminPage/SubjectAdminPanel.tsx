import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useSubjects } from 'hooks/useApi';
import DuplicateButton from './DuplicateButton';
import SubjectCardContents from './SubjectCardContents';
import SubjectSettingsForm from './SubjectSettingsForm';
import AddButton from '../AddButton';

export default function SubjectAdminPanel() {
  const { subjects, isLoading, isError } = useSubjects();

  if (isError || isLoading || !subjects) {
    return null;
  }

  const disabled = true;

  return (
    <>
      <AddButton
        buttonLabel="Add subject"
        dialogTitle="Create a new subject"
        formComponent={<SubjectSettingsForm />}
        disabled={disabled}
      />
      <EntityListWithFilters
        entityName="Subject"
        entityDatabaseName="Subject"
        entityPrimaryKeyName="name"
        entities={subjects}
        DuplicateButton={DuplicateButton}
        FormComponent={SubjectSettingsForm}
        EntityCardContents={SubjectCardContents}
        disabled={disabled}
      />
    </>
  );
}
