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
import { useState } from 'react';

type DeleteButtonProps = {
  buttonLabel: string;
  dialogTitle: JSX.Element;
  onDelete: () => void;
  valueToMatch: string;
};

export default function DeleteButton({
  buttonLabel,
  dialogTitle,
  onDelete,
  valueToMatch,
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [securityPhrase, setSecurityPhrase] = useState('');

  function handleOpenConfirmationMessage() {
    setIsOpen(true);
  }

  function handleCloseConfirmationMessage() {
    setSecurityPhrase('');
    setIsOpen(false);
  }

  function handleDelete() {
    onDelete();
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        aria-label="delete"
        title={buttonLabel}
        onClick={handleOpenConfirmationMessage}
      >
        <DeleteIcon color="error" />
      </IconButton>
      <Dialog open={isOpen} onClose={handleCloseConfirmationMessage}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <Typography>
              Type in <strong>{valueToMatch}</strong> in the field below and
              click DELETE.
            </Typography>
            <TextField
              value={securityPhrase}
              onChange={(event) => setSecurityPhrase(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            disabled={securityPhrase !== valueToMatch}
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
