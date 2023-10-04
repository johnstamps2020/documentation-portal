import AdminDeleteButton from 'components/AdminPage/DeleteButton';
import { useNotification } from 'components/Layout/NotificationContext';

type DeleteButtonProps = {
  externalLinkUrl: string;
};

export default function DeleteButton({ externalLinkUrl }: DeleteButtonProps) {
  const { showMessage } = useNotification();

  async function handleDelete() {
    const response = await fetch(`/admin/entity/ExternalLink`, {
      method: 'DELETE',
      body: JSON.stringify({
        url: externalLinkUrl,
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
          Delete external link <strong>{externalLinkUrl}</strong>
        </>
      }
      onDelete={handleDelete}
      valueToMatch={externalLinkUrl}
    />
  );
}
