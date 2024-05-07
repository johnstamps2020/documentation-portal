import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { Translate, translate } from '../../lib';
import { ChatFilters } from './ChatFilters';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export function ChatFiltersButton() {
  const title = translate({
    id: 'chat.filters',
    message: 'Filters',
  });
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outlined">
        <Translate id="chat.filters">{title}</Translate>
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          sx={{
            padding: 2,
          }}
        >
          <ChatFilters />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Translate id="button.close">Close</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
