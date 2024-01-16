import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { useState } from 'react';
import AdminDialog from '../AdminDialog';
import { useAdminViewContext } from '../AdminViewContext';
import EditMultipleForm from './EditMultipleForm';

export default function EditButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedEntities, entityDatabaseName } = useAdminViewContext();

  if (selectedEntities.length === 0) {
    return null;
  }

  function handleOpenEditor() {
    setIsOpen(true);
  }

  function handleCloseEditor() {
    setIsOpen(false);
  }

  const label =
    selectedEntities.length === 1
      ? `Edit selected ${entityDatabaseName}`
      : `Edit ${selectedEntities.length} ${entityDatabaseName}s`;

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenEditor}
        startIcon={<EditIcon />}
      >
        {label}
      </Button>
      <AdminDialog
        label={label}
        onClose={handleCloseEditor}
        isOpen={isOpen}
        showInFullScreen
      >
        <EditMultipleForm />
      </AdminDialog>
    </>
  );
}
