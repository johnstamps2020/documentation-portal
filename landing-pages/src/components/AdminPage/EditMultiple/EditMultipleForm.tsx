import Container from '@mui/material/Container';
import AdminFormWrapper from '../AdminFormWrapper';
import EditMultipleChangeList from './EditMultipleChangeList';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleFields from './EditMultipleFields';

export default function EditMultipleForm() {
  const { thereAreChanges, handleResetForm } = useEditMultipleContext();

  return (
    <AdminFormWrapper
      disabled={!thereAreChanges}
      dataChanged={thereAreChanges}
      canSubmitData={thereAreChanges}
      handleSave={() => {}}
      handleResetForm={handleResetForm}
    >
      <Container>
        <EditMultipleFields />
        <EditMultipleChangeList />
      </Container>
    </AdminFormWrapper>
  );
}
