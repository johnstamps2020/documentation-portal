import AddIcon from '@mui/icons-material/Add';
import PageSettingsForm from './PageSettingsForm';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import PageSettingsDialog from './PageSettingsDialog';

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
        title="New page settings"
        isOpen={isOpen}
        onClose={handleCloseEditor}
      />
    </>
  );
}
