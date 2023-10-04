import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import PageSettingsDialog from 'components/EntitiesAdminPage/PageAdminPage/PageSettingsDialog';
import PageSettingsForm from 'components/EntitiesAdminPage/PageAdminPage/PageSettingsForm';
import { useState } from 'react';
import { useEnvInfo, useUserInfo } from '../../hooks/useApi';
import { prodDeployEnv } from '../../vars';

type EditPagePropsButtonProps = {
  pagePath: string;
};
export default function EditPagePropsButton({
  pagePath,
}: EditPagePropsButtonProps) {
  const {
    userInfo,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
  } = useUserInfo();
  const {
    envInfo,
    isLoading: isEnvInfoLoading,
    isError: isEnvInfoError,
  } = useEnvInfo();
  const [isOpen, setIsOpen] = useState(false);

  if (isEnvInfoLoading || isEnvInfoError || envInfo?.name === prodDeployEnv) {
    return null;
  }

  if (isUserInfoLoading || isUserInfoError || !userInfo?.isAdmin) {
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
        sx={{ width: 'fit-content' }}
      >
        <EditIcon sx={{ mr: 1 }} />
        Edit page
      </Fab>
      <PageSettingsDialog
        title="Update page settings"
        isOpen={isOpen}
        onClose={handleCloseEditor}
      >
        <PageSettingsForm pagePath={pagePath} />
      </PageSettingsDialog>
    </>
  );
}
