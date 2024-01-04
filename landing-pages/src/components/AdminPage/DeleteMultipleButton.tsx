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
      selectedEntities.map((entity) => {
        const primaryKeyValue =
          entity.path || entity.url || entity.id || entity.name;
        return fetch(`/admin/entity/${entityDatabaseName}`, {
          method: 'DELETE',
          body: `{ "${entityPrimaryKeyName}": "${primaryKeyValue}" }`,
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

      const queryFailedErrorMessage = 'update or delete on table';
      if (
        jsonError.map((error) =>
          error.message.includes(queryFailedErrorMessage)
        )
      ) {
        const entityTypeFromError = jsonError.map(
          (error) => error.message.match(/on table "((?!source)[^"]+)"/)[1]
        );
        showMessage(
          `${entityDatabaseName} not deleted - this ${entityDatabaseName} is connected with another entity 
           named ${entityTypeFromError}. Please remove this ${entityDatabaseName} from the
           ${entityTypeFromError} and try again.`,
          'error'
        );
      } else {
        showMessage(
          `${
            failedResponses.length
          } items of type ${entityDatabaseName} not deleted correctly: ${JSON.stringify(
            jsonError
          )}`,
          'error'
        );
      }
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
      Delete {selectedEntities.length} item
      {selectedEntities.length > 1 && 's'}
    </Button>
  );
}
