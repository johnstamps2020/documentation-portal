import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Entity } from '../EntityListWithFilters';

type ChangeListDetailsButtonProps = {
  entity: Entity;
};

export default function ChangeListDetailsButton({
  entity,
}: ChangeListDetailsButtonProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      <IconButton aria-label="Details" onClick={handleOpen}>
        <InfoIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={handleClose}>
        <Stack direction="row" justifyContent="flex-end">
          <IconButton aria-label="Close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack
          sx={{
            padding: '32px 16px',
            gap: '16px',
          }}
        >
          <Typography variant="h2" component="div">
            Details for {entity.label || entity.title}
          </Typography>
          <pre>
            <code>{JSON.stringify(entity, null, 2)}</code>
          </pre>
        </Stack>
      </Dialog>
    </>
  );
}
