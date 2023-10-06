import AdminDeleteButton from 'components/AdminPage/DeleteButton';
import { useNotification } from 'components/Layout/NotificationContext';

type DeleteButtonProps = {
  pagePath: string;
};
export default function DeleteButton({ pagePath }: DeleteButtonProps) {
  const { showMessage } = useNotification();

  async function handleDelete() {
    const response = await fetch(`/admin/entity/Page`, {
      method: 'DELETE',
      body: JSON.stringify({
        path: pagePath,
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
          Delete page <strong>{pagePath}</strong>
        </>
      }
      onDelete={handleDelete}
      valueToMatch={pagePath}
    />
  );
}
