import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import PageSettingsForm from 'components/PageAdminPage/PageSettingsForm';

type PageSettingsDialogProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  pagePath?: string;
};

export default function PageSettingsDialog({
  title,
  pagePath,
  isOpen,
  onClose,
}: PageSettingsDialogProps): JSX.Element {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <PageSettingsForm pagePath={pagePath} title={title} />
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
