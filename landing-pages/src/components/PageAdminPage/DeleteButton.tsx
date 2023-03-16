import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

type DeleteMessage = {
  text: string;
  severity: AlertColor;
  isOpen: boolean;
};

const emptyDeleteMessage: DeleteMessage = {
  text: '',
  severity: 'info',
  isOpen: false,
};

// TODO: Change confirmation for a text field where you need to type in a value
type DeleteButtonProps = {
  pagePath: string;
};
export default function DeleteButton({ pagePath }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteResultMessage, setDeleteResultMessage] =
    useState<DeleteMessage>(emptyDeleteMessage);

  function handleOpenConfirmationMessage() {
    setIsOpen(true);
  }

  function handleCloseConfirmationMessage() {
    setIsOpen(false);
  }

  function handleCloseDeleteResultMessage() {
    setDeleteResultMessage(emptyDeleteMessage);
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
      setDeleteResultMessage({
        text: 'Page deleted successfully',
        severity: 'success',
        isOpen: true,
      });
    } else {
      const jsonError = await response.json();
      setDeleteResultMessage({
        text: `Page not deleted: ${jsonError.message}`,
        severity: 'error',
        isOpen: true,
      });
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
      <Dialog open={isOpen}>
        <DialogTitle>Are you sure you want to delete this page?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmationMessage} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={deleteResultMessage.isOpen}
        onClose={handleCloseDeleteResultMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseDeleteResultMessage}
          sx={{ width: '100%' }}
          severity={deleteResultMessage.severity}
        >
          {deleteResultMessage.text}
        </Alert>
      </Snackbar>
    </>
  );
}
