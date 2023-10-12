import AdminDeleteButton from 'components/AdminPage/DeleteButton';
import { useNotification } from 'components/Layout/NotificationContext';

type DeleteButtonProps = {
  primaryKey: string;
};
export default function DeleteButton({ primaryKey }: DeleteButtonProps) {
  const { showMessage } = useNotification();

  async function handleDelete() {
    const response = await fetch(`/admin/entity/Page`, {
      method: 'DELETE',
      body: JSON.stringify({
        path: primaryKey,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      showMessage('Page deleted successfully', 'success');
    } else {
      const jsonError = await response.json();
      showMessage(`Page not deleted: ${jsonError.message}`, 'error');
    }
  }

  return (
    <AdminDeleteButton
      buttonLabel="Delete page"
      dialogTitle={
        <>
          Delete page <strong>{primaryKey}</strong>
        </>
      }
      onDelete={handleDelete}
      valueToMatch={primaryKey}
    />
  );
}
