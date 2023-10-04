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
  externalLinkUrl: string;
};

export default function DeleteButton({ externalLinkUrl }: DeleteButtonProps) {
  const { showMessage } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState('');

  function handleOpenConfirmationMessage() {
    setIsOpen(true);
  }

  function handleCloseConfirmationMessage() {
    setDeleteUrl('');
    setIsOpen(false);
  }

  async function handleDelete() {
    const response = await fetch(`/admin/entity/ExternalLink`, {
      method: 'DELETE',
      body: JSON.stringify({
        externalLinkUrl: externalLinkUrl,
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
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        aria-label="delete"
        title="Delete external link"
        onClick={handleOpenConfirmationMessage}
      >
        <DeleteIcon color="error" />
      </IconButton>
      <Dialog open={isOpen} onClose={handleCloseConfirmationMessage}>
        <DialogTitle>
          Delete external link <strong>{externalLinkUrl}</strong>
        </DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <Typography>
              Type in <strong>{externalLinkUrl}</strong> in the field below and click
              DELETE.
            </Typography>
            <TextField
              value={deleteUrl}
              onChange={(event) => setDeleteUrl(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            disabled={deleteUrl !== externalLinkUrl}
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
