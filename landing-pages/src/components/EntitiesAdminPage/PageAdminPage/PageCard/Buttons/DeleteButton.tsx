import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useState } from 'react';

type DeleteButtonProps = {
  pagePath: string;
};
export default function DeleteButton({ pagePath }: DeleteButtonProps) {
  const { showMessage } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [deletePath, setDeletePath] = useState('');

  function handleOpenConfirmationMessage() {
    setIsOpen(true);
  }

  function handleCloseConfirmationMessage() {
    setDeletePath('');
    setIsOpen(false);
  }

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
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        aria-label="delete"
        title="Delete page"
        onClick={handleOpenConfirmationMessage}
      >
        <DeleteIcon color="error" />
      </IconButton>
      <Dialog open={isOpen} onClose={handleCloseConfirmationMessage}>
        <DialogTitle>
          Delete page <strong>{pagePath}</strong>
        </DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <Typography>
              Type in <strong>{pagePath}</strong> in the field below and click
              DELETE.
            </Typography>
            <TextField
              value={deletePath}
              onChange={(event) => setDeletePath(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            disabled={deletePath !== pagePath}
            color="error"
          >
            Delete
          </Button>
          <Button onClick={handleCloseConfirmationMessage} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
