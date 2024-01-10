import AdminDuplicateButton from 'components/AdminPage/AdminDuplicateButton';
import { useSubjectData } from 'hooks/useEntitiesData';
import { Subject } from 'server/dist/model/entity/Subject';
import SubjectSettingsForm from './SubjectSettingsForm';

type DuplicateButtonProps = {
  primaryKey: string;
};

export default function DuplicateButton({ primaryKey }: DuplicateButtonProps) {
  const { isError, isLoading, subjectData } =
    useSubjectData(primaryKey);

  if (isError || isLoading || !subjectData) {
    return null;
  }

  function getSubjectDataWithoutUuid(subjectData: Subject) {
    const { uuid, ...rest } = subjectData;
    return rest;
  }

  return (
    <AdminDuplicateButton
      buttonLabel="Duplicate subject"
      dialogTitle="Duplicate subject"
      leftFormTitle="Source subject"
      leftFormComponent={
        <SubjectSettingsForm
          initialSubjectData={getSubjectDataWithoutUuid(
            subjectData
          )}
          disabled
        />
      }
      rightFormTitle="New subject"
      rightFormComponent={
        <SubjectSettingsForm
          initialSubjectData={getSubjectDataWithoutUuid(
            subjectData
          )}
        />
      }
    />
  );
}
