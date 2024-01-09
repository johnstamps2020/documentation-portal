import EntityListWithFilters from 'components/AdminPage/EntityListWithFilters';
import { useSubjects } from '../../../hooks/useApi';
import DuplicateButton from './DuplicateButton';
import SubjectCardContents from './SubjectCardContents';
import SubjectSettingsForm from './SubjectSettingsForm';

export default function SubjectAdminPanel() {
  const { subjects, isLoading, isError } = useSubjects();

  if (isError || isLoading || !subjects) {
    return null;
  }

  return (
    <EntityListWithFilters
      entityName="Subject"
      entityDatabaseName="Subject"
      entityPrimaryKeyName="name"
      entities={subjects.map(({ name, ...rest }) => ({
        label: name,
        name: name,
        ...rest,
      }))}
      DuplicateButton={DuplicateButton}
      FormComponent={SubjectSettingsForm}
      EntityCardContents={SubjectCardContents}
    />
  );
}
