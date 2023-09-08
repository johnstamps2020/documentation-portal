import Alert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export type NotificationProps = {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  severity: AlertProps['severity'];
};

export default function Notification({
  isOpen,
  onClose,
  severity,
  text,
}: NotificationProps): JSX.Element {
  return (
    <Snackbar
      open={isOpen}
      onClose={onClose}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} sx={{ width: '100%' }} severity={severity}>
        {text}
      </Alert>
    </Snackbar>
  );
}
