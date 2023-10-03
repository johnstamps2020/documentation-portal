import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import ExternalLinkSettingsDialog from '../../ExternalLinkSettingsDialog';
import ExternalLinkSettingsForm from '../../ExternalLinkSettingsForm';

type EditButtonProps = {
  externalLinkUrl: string;
};

export default function EditButton({ externalLinkUrl }: EditButtonProps) {
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
        title="Open external link editor"
        onClick={handleOpenEditor}
      >
        <EditIcon color="primary" />
      </IconButton>
      <ExternalLinkSettingsDialog
        label="Update external link settings"
        onClose={handleCloseEditor}
        isOpen={isOpen}
      >
        <ExternalLinkSettingsForm url={externalLinkUrl} />
      </ExternalLinkSettingsDialog>
    </>
  );
}
