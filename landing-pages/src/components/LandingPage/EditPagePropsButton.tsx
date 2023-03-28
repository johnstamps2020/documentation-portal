import EditIcon from '@mui/icons-material/Edit';
import PagePropsController from '../LandingPage/PagePropsController';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { useUserInfo } from '../../hooks/useApi';

type EditPagePropsButtonProps = {
  pagePath: string;
};
export default function EditPagePropsButton({
  pagePath,
}: EditPagePropsButtonProps) {
  const { userInfo, isLoading, isError } = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || isError || !userInfo?.isAdmin) {
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
        <PagePropsController pagePath={pagePath} />
        <DialogActions>
          <Button onClick={handleCloseEditor}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
