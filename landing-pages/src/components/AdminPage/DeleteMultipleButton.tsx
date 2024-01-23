import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useNotification } from 'components/Layout/NotificationContext';
import { useAdminViewContext } from './AdminViewContext';

export default function DeleteMultipleButton() {
  const { showMessage } = useNotification();
  const { selectedEntities, setSelectedEntities, entityDatabaseName } =
    useAdminViewContext();

  if (selectedEntities.length === 0) {
    return null;
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/admin/entities/${entityDatabaseName}`, {
        method: 'DELETE',
        body: JSON.stringify(selectedEntities),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const jsonResult = await response.json();

      if (!response.ok) {
        showMessage(
          `Error deleting ${entityDatabaseName}: ${JSON.stringify(jsonResult)}`,
          'error'
        );
        return;
      }

      showMessage(
        `Deleted ${jsonResult.affected} items of type ${entityDatabaseName} successfully`,
        'success'
      );
      setSelectedEntities([]);
    } catch (error) {
      showMessage(`Error deleting entities: ${error}`, 'error');
    }
  }

  return (
    <Button
      color="error"
      variant="contained"
      startIcon={<DeleteIcon />}
      onClick={handleDelete}
    >
      Delete {selectedEntities.length} item
      {selectedEntities.length > 1 && 's'}
    </Button>
  );
}
