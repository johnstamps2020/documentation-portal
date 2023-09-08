import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import { useEnvInfo, useUserInfo } from '../../hooks/useApi';
import { prodDeployEnv } from '../../vars';
import PageSettingsDialog from 'components/PageAdminPage/PageSettingsDialog';

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
        sx={{ width: 'fit-content', margin: '8px' }}
      >
        <EditIcon sx={{ mr: 1 }} />
        Edit page
      </Fab>
      <PageSettingsDialog
        pagePath={pagePath}
        title="Page settings"
        isOpen={isOpen}
        onClose={handleCloseEditor}
      />
    </>
  );
}
