import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PagePropsController from '../LandingPage/PagePropsController';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type EditButtonProps = {
  pagePath: string;
};
export default function EditButton({ pagePath }: EditButtonProps) {
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
        title="Open page editor"
        onClick={handleOpenEditor}
      >
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={isOpen}>
        <PagePropsController pagePath={pagePath} fullEditMode />
        <DialogActions>
          <Button onClick={handleCloseEditor}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
