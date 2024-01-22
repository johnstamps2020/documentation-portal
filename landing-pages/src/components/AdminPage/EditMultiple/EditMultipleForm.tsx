import Container from '@mui/material/Container';
import { useNotification } from 'components/Layout/NotificationContext';
import AdminFormWrapper from '../AdminFormWrapper';
import { useAdminViewContext } from '../AdminViewContext';
import EditMultipleChangeList from './EditMultipleChangeList';
import { useEditMultipleContext } from './EditMultipleContext';
import EditMultipleFields from './EditMultipleFields';
import { MultipleOperationMode } from '../MultipleButton';
import { useEffect } from 'react';

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
    const failedResponseErrorMessages: string[] = [];
    let successfulResponseCount = 0;
    await Promise.all(
      entityDiffList.map(async ({ newEntity }) => {
        const response = await fetch(`/admin/entity/${entityDatabaseName}`, {
          method: 'PUT',
          body: JSON.stringify(newEntity),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const jsonError = await response.json();
          failedResponseErrorMessages.push(
            `Error updating entity: ${JSON.stringify(
              newEntity
            )}. Error received: ${JSON.stringify(jsonError)}`
          );
        } else {
          successfulResponseCount++;
        }
      })
    );

    if (failedResponseErrorMessages.length) {
      failedResponseErrorMessages.forEach((errorMessage, index) =>
        showMessage(
          `PROBLEM ${index + 1}/${
            failedResponseErrorMessages.length
          } ${errorMessage}`,
          'error'
        )
      );
    }

    if (successfulResponseCount) {
      showMessage(
        `Successfully updated ${successfulResponseCount} entities`,
        'success'
      );
      handleResetForm();
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
