import Alert, { AlertProps } from '@mui/material/Alert';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import React from 'react';

export type NotificationProps = {
  message: JSX.Element;
  open: SnackbarProps['open'];
  severity: AlertProps['severity'];
  onClose: AlertProps['onClose'];
};

export default function Notification({
  open,
  onClose,
  severity,
  message,
}: NotificationProps) {
  return (
    <Snackbar open={open} onClose={onClose} autoHideDuration={undefined}>
      <Alert severity={severity} variant="filled" onClose={onClose}>
        <Typography component="div">{message}</Typography>
      </Alert>
    </Snackbar>
  );
}
