import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import AccessControl from 'components/AccessControl/AccessControl';
import AdminDialog from 'components/AdminPage/AdminDialog';
import PageSettingsForm from 'components/AdminPage/PageAdminPage/PageSettingsForm';
import { useState } from 'react';

type EditPagePropsButtonProps = {
  pagePath: string;
};
export default function EditPagePropsButton({
  pagePath,
}: EditPagePropsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenEditor() {
    setIsOpen(true);
  }

  function handleCloseEditor() {
    setIsOpen(false);
  }

  return (
    <AccessControl
      allowedOnEnvs={['dev', 'staging']}
      accessLevel="admin"
      doNotNavigate
    >
      <Fab
        variant="extended"
        color="warning"
        aria-label="edit"
        title="Open page editor"
        onClick={handleOpenEditor}
        size="medium"
        sx={{ width: 'fit-content' }}
      >
        <EditIcon sx={{ mr: 1 }} />
        Edit page
      </Fab>
      <AdminDialog
        label="Update page settings"
        isOpen={isOpen}
        onClose={handleCloseEditor}
      >
        <PageSettingsForm primaryKey={pagePath} />
      </AdminDialog>
    </AccessControl>
  );
}
