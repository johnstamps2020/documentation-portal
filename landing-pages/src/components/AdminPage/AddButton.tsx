import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { useState } from 'react';
import AdminDialog from './AdminDialog';

type AddButtonProps = {
  formComponent: JSX.Element;
  buttonLabel: string;
  dialogTitle: string;
  disabled: boolean;
};

export default function AddButton({
  formComponent,
  dialogTitle,
  buttonLabel,
  disabled,
}: AddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (disabled) {
    return <></>;
  }

  function handleOpenEditor() {
    setIsOpen(true);
  }

  function handleCloseEditor() {
    setIsOpen(false);
  }

  return (
    <>
      <Fab
        variant="extended"
        color="success"
        aria-label="edit"
        title="Open page editor"
        onClick={handleOpenEditor}
        size="medium"
        sx={{ width: 'fit-content', display: 'flex', gap: 1 }}
      >
        <AddIcon />
        {buttonLabel}
      </Fab>
      <AdminDialog
        label={dialogTitle}
        isOpen={isOpen}
        onClose={handleCloseEditor}
      >
        {formComponent}
      </AdminDialog>
    </>
  );
}
