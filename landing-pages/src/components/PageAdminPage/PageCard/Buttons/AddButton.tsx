import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import PageSettingsForm from 'components/PageAdminPage/PageSettingsForm';
import { useState } from 'react';
import PageSettingsDialog from '../../PageSettingsDialog';

export default function AddButton() {
  const [isOpen, setIsOpen] = useState(false);

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
        sx={{ width: 'fit-content', margin: '8px' }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add page
      </Fab>
      <PageSettingsDialog
        title="Create a new page"
        isOpen={isOpen}
        onClose={handleCloseEditor}
      >
        <PageSettingsForm />
      </PageSettingsDialog>
    </>
  );
}
