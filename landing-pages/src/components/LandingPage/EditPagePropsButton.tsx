import EditIcon from '@mui/icons-material/Edit';
import PagePropsController from '../LandingPage/PagePropsController';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
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
        sx={{ width: 'fit-content', margin: '8px' }}
      >
        <EditIcon sx={{ mr: 1 }} />
        Edit page
      </Fab>
      <Dialog open={isOpen}>
        <PagePropsController pagePath={pagePath} title="Page properties" />
        <DialogActions>
          <Button onClick={handleCloseEditor}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
