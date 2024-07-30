import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useDocItemContext } from './DocItem/DocItem';

export default function PublicBadge() {
  const { isPublic } = useDocItemContext();

  if (!isPublic) {
    return null;
  }

  return (
    <Tooltip title="This page is available without logging in. The information on this page is visible to anyone on the internet. This badge is only visible to Guidewire employees.">
      <Chip color="success" label="Public" />
    </Tooltip>
  );
}
