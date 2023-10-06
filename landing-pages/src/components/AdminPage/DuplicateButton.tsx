import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import AdminDialog from './AdminDialog';

export type DuplicateButtonProps = {
  leftFormTitle: string;
  leftFormComponent: JSX.Element;
  rightFormTitle: string;
  rightFormComponent: JSX.Element;
  buttonLabel: string;
  dialogTitle: string;
};

function FormHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 'bold',
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

export default function DuplicateButton({
  leftFormComponent,
  leftFormTitle,
  rightFormComponent,
  rightFormTitle,
  buttonLabel,
  dialogTitle,
}: DuplicateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleCloseDialog() {
    setIsOpen(false);
  }

  function handleOpenDialog() {
    setIsOpen(true);
  }

  return (
    <>
      <IconButton
        aria-label="edit"
        title={buttonLabel}
        onClick={handleOpenDialog}
      >
        <ContentCopyIcon color="primary" />
      </IconButton>
      <AdminDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        label={dialogTitle}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 4,
          }}
        >
          <Stack gap={2}>
            <FormHeading>{leftFormTitle}</FormHeading>
            {leftFormComponent}
          </Stack>
          <Stack gap={2}>
            <FormHeading>{rightFormTitle}</FormHeading>
            {rightFormComponent}
          </Stack>
        </Box>
      </AdminDialog>
    </>
  );
}
