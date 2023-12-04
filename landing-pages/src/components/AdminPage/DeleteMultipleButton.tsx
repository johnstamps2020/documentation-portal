import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useAdminViewContext } from './AdminViewContext';
import { useNotification } from 'components/Layout/NotificationContext';

export default function DeleteMultipleButton() {
  const { showMessage } = useNotification();
  const {
    selectedEntities,
    setSelectedEntities,
    entityDatabaseName,
    entityPrimaryKeyName,
  } = useAdminViewContext();

  if (selectedEntities.length === 0) {
    return null;
  }

  async function handleDelete() {
    const responses = await Promise.all(
      selectedEntities.map(({ url }) => {
        return fetch(`/admin/entity/${entityDatabaseName}`, {
          method: 'DELETE',
          body: `{ "${entityPrimaryKeyName}": "${url}" }`,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      })
    );

    const failedResponses = responses.filter((response) => !response.ok);
    if (failedResponses.length) {
      const jsonError = await Promise.all(
        failedResponses.map((response) => response.json())
      );
      showMessage(
        `${
          failedResponses.length
        } items of type ${entityDatabaseName} not deleted correctly: ${JSON.stringify(
          jsonError
        )}`,
        'error'
      );
    } else {
      showMessage(
        `All ${selectedEntities.length} items of type ${entityDatabaseName} deleted successfully`,
        'success'
      );
      setSelectedEntities([]);
    }
  }

  return (
    <Button
      color="error"
      variant="contained"
      startIcon={<DeleteIcon />}
      onClick={handleDelete}
    >
      Delete {selectedEntities.length} item{selectedEntities.length > 1 && 's'}
    </Button>
  );
}
