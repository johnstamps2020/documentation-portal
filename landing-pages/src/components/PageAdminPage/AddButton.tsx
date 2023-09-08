import AddIcon from '@mui/icons-material/Add';
import PagePropsController from '../LandingPage/PagePropsController';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';

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
      <Dialog open={isOpen} onClose={handleCloseEditor}>
        <PagePropsController title="New page properties" fullEditMode />
        <DialogActions>
          <Button onClick={handleCloseEditor}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
