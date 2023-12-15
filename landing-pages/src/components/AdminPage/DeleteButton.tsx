import AdminDeleteButton from './AdminDeleteButton';
import { useNotification } from 'components/Layout/NotificationContext';
import { useAdminViewContext } from './AdminViewContext';

type DeleteButtonProps = {
  primaryKey: string;
};
export default function DeleteButton({ primaryKey }: DeleteButtonProps) {
  const { showMessage } = useNotification();

  const { entityDatabaseName, entityPrimaryKeyName } = useAdminViewContext();

  async function handleDelete() {
    const response = await fetch(`/admin/entity/${entityDatabaseName}`, {
      method: 'DELETE',
      body: `{ "${entityPrimaryKeyName}": "${primaryKey}" }`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      showMessage(`${entityDatabaseName} deleted successfully`, 'success');
    } else {
      const jsonError = await response.json();
      const queryFailedErrorMessage = 'violates foreign key constraint';
      if (jsonError.message.includes(queryFailedErrorMessage)) {
        const entityTypeFromError = jsonError.message.match(
          /(on table).*?(on table "([^"]+)")/
        )[2];
        showMessage(
          `${entityDatabaseName} not deleted - this ${entityDatabaseName} is connected with another entity 
           named ${entityTypeFromError}. Please remove this ${entityDatabaseName} from the
           ${entityTypeFromError} and try again.`,
          'error'
        );
      } else {
        showMessage(
          `${entityDatabaseName} not deleted: ${jsonError.message}`,
          'error'
        );
      }
    }
  }

  return (
    <AdminDeleteButton
      buttonLabel={`Delete ${entityDatabaseName}`}
      dialogTitle={
        <>
          Delete {entityDatabaseName} <strong>{primaryKey}</strong>
        </>
      }
      onDelete={handleDelete}
      valueToMatch={primaryKey}
    />
  );
}
