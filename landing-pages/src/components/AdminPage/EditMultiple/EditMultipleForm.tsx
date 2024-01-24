import Container from '@mui/material/Container';
import { useNotification } from 'components/Layout/NotificationContext';
import { useEffect } from 'react';
import AdminFormWrapper from '../AdminFormWrapper';
import { useAdminViewContext } from '../AdminViewContext';
import { MultipleOperationMode } from './MultipleButton';
import EditMultipleChangeList from './EditMultipleChangeList';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleFields from './EditMultipleFields';

type EditMultipleFormProps = {
  mode: MultipleOperationMode;
};

export default function EditMultipleForm({ mode }: EditMultipleFormProps) {
  const { thereAreChanges, handleResetForm, entityDiffList } =
    useEditMultipleContext();
  const { entityDatabaseName, setMode } = useAdminViewContext();
  const { showMessage } = useNotification();

  useEffect(() => {
    setMode(mode);

    return () => setMode(null);
  }, [mode, setMode]);

  async function handleSave() {
    try {
      const newEntities = entityDiffList.map(({ newEntity }) => newEntity);
      const response = await fetch(`/admin/entities/${entityDatabaseName}`, {
        method: 'PUT',
        body: JSON.stringify(newEntities),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const jsonResult = await response.json();

      if (!response.ok) {
        showMessage(
          `Error updating ${entityDatabaseName}: ${JSON.stringify(jsonResult)}`,
          'error'
        );
        return;
      }

      showMessage(
        `Successfully updated ${newEntities.length} items of type ${entityDatabaseName} successfully`,
        'success'
      );
    } catch (error) {
      showMessage(`Error deleting entities: ${error}`, 'error');
    }
  }

  return (
    <AdminFormWrapper
      disabled={!thereAreChanges}
      dataChanged={thereAreChanges}
      canSubmitData={thereAreChanges}
      handleSave={handleSave}
      handleResetForm={handleResetForm}
    >
      <Container>
        <EditMultipleFields />
        <EditMultipleChangeList />
      </Container>
    </AdminFormWrapper>
  );
}
