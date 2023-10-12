import AdminDeleteButton from 'components/AdminPage/DeleteButton';
import { useNotification } from 'components/Layout/NotificationContext';

type DeleteButtonProps = {
  primaryKey: string;
};

export default function DeleteButton({ primaryKey }: DeleteButtonProps) {
  const { showMessage } = useNotification();

  async function handleDelete() {
    const response = await fetch(`/admin/entity/ExternalLink`, {
      method: 'DELETE',
      body: JSON.stringify({
        url: primaryKey,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      showMessage('External link deleted successfully', 'success');
    } else {
      const jsonError = await response.json();
      showMessage(`External link not deleted: ${jsonError.message}`, 'error');
    }
  }

  return (
    <AdminDeleteButton
      buttonLabel="Delete external link"
      dialogTitle={
        <>
          Delete external link <strong>{primaryKey}</strong>
        </>
      }
      onDelete={handleDelete}
      valueToMatch={primaryKey}
    />
  );
}
