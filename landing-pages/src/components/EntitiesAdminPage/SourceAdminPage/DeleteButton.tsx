import AdminDeleteButton from 'components/AdminPage/DeleteButton';
import { useNotification } from 'components/Layout/NotificationContext';

type DeleteButtonProps = {
  primaryKey: string;
};

export default function DeleteButton({ primaryKey }: DeleteButtonProps) {
  const { showMessage } = useNotification();

  async function handleDelete() {
    const response = await fetch(`/admin/entity/Source`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: primaryKey,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      showMessage('Source deleted successfully', 'success');
    } else {
      const jsonError = await response.json();
      const queryFailedErrorMessage =
        'update or delete on table "source" violates foreign key constraint';
      if (jsonError.message.includes(queryFailedErrorMessage)) {
        const entityTypeFromError = jsonError.message.match(
          /on table "((?!source)[^"]+)"/
        )[1]; 
        showMessage(
          `Source not deleted - this source is connected with another entity 
           named ${entityTypeFromError}. Please remove this source from the
           ${entityTypeFromError} and try again.`,
          'error'
        );
      } else {
        showMessage(`Source not deleted: ${jsonError.message}`, 'error');
      }
    }
  }

  return (
    <AdminDeleteButton
      buttonLabel="Delete source"
      dialogTitle={
        <>
          Delete source <strong>{primaryKey}</strong>
        </>
      }
      onDelete={handleDelete}
      valueToMatch={primaryKey}
    />
  );
}
