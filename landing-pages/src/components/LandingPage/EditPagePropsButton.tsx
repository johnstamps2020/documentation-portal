import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import AdminDialog from 'components/AdminPage/AdminDialog';
import PageSettingsForm from 'components/AdminPage/PageAdminPage/PageSettingsForm';
import { usePageData } from 'hooks/usePageData';
import { useState } from 'react';

export default function EditPagePropsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { pageData } = usePageData();

  if (!pageData) {
    return null;
  }

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
        color="warning"
        aria-label="edit"
        title="Open page editor"
        onClick={handleOpenEditor}
        size="medium"
        sx={{ width: 'fit-content', display: 'flex', gap: 1 }}
      >
        <EditIcon />
        <Typography>Edit page</Typography>
      </Fab>
      <AdminDialog
        label="Update page settings"
        isOpen={isOpen}
        onClose={handleCloseEditor}
      >
        <PageSettingsForm primaryKey={pageData.path} />
      </AdminDialog>
    </>
  );
}
