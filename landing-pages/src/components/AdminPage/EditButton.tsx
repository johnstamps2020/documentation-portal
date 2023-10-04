import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import AdminDialog from './AdminDialog';

type EditButtonProps = {
  formComponent: JSX.Element;
  buttonLabel: string;
  dialogTitle: string;
};

export default function EditButton({
  formComponent,
  buttonLabel,
  dialogTitle,
}: EditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenEditor() {
    setIsOpen(true);
  }

  function handleCloseEditor() {
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        aria-label="edit"
        title={buttonLabel}
        onClick={handleOpenEditor}
      >
        <EditIcon color="primary" />
      </IconButton>
      <AdminDialog
        label={dialogTitle}
        onClose={handleCloseEditor}
        isOpen={isOpen}
      >
        {formComponent}
      </AdminDialog>
    </>
  );
}
