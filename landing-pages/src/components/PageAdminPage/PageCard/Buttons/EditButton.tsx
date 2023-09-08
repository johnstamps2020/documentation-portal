import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PageSettingsForm from 'components/PageAdminPage/PageSettingsForm';
import { useState } from 'react';
import PageSettingsDialog from '../../PageSettingsDialog';

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
      <PageSettingsDialog
        title="Edit page settings"
        onClose={handleCloseEditor}
        isOpen={isOpen}
      >
        <PageSettingsForm pagePath={pagePath} />
      </PageSettingsDialog>
    </>
  );
}
