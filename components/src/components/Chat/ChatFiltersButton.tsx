import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { Translate, translate } from '../../lib';
import { ChatFilters } from './ChatFilters';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useChat } from './ChatContext';
import Box from '@mui/material/Box';

export function ChatFiltersButton() {
  const { filterCount } = useChat();
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
      <Button
        onClick={handleOpen}
        variant="outlined"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Translate id="chat.filters">{title}</Translate>
        <Box>({filterCount.toString()})</Box>
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          sx={{
            p: 2,
            m: 2,
          }}
        >
          <ChatFilters />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <Translate id="chat.saveAndClose">Save and close</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
