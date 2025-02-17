import { Tooltip } from '@mui/material';
import React from 'react';

type HeaderTooltipProps = {
  title: string;
  children: React.ReactElement<any>;
};

export default function HeaderTooltip({ title, children }: HeaderTooltipProps) {
  return (
    <Tooltip title={title} placement="bottom-end" enterDelay={500}>
      {children}
    </Tooltip>
  );
}
