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
      showMessage(`Source not deleted: ${jsonError.message}`, 'error');
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
