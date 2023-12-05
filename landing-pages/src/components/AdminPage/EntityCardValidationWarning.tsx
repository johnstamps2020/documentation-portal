import WarningIcon from '@mui/icons-material/Warning';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useAdminViewContext } from './AdminViewContext';

type EntityCardValidationWarningProps = {
  children: React.ReactNode;
};

export default function EntityCardValidationWarning({
  children,
}: EntityCardValidationWarningProps) {
  const { listView } = useAdminViewContext();

  if (listView) {
    return (
      <Tooltip title={children}>
        <WarningIcon color="warning" sx={{ m: 'auto 8px' }} />
      </Tooltip>
    );
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        mb: '16px',
        p: '6px',
        border: 1,
        borderColor: '#FF7F7F',
      }}
    >
      <WarningIcon color="warning" sx={{ m: 'auto 8px' }} />
      <Typography>{children}</Typography>
    </Paper>
  );
}
