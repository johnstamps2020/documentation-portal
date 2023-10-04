import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type ExternalLinkSettingsDialogProps = {
  label: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ExternalLinkSettingsDialog({
  label,
  isOpen,
  onClose,
  children,
}: ExternalLinkSettingsDialogProps): JSX.Element {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{label}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
