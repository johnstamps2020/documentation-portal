import { Tooltip } from '@mui/material';
import React from 'react';

type TooltipWrapperProps = {
  title: string;
  children: React.ReactElement<any>;
};

export default function HeaderTooltip({
  title,
  children,
}: TooltipWrapperProps) {
  return (
    <Tooltip title={title} placement="bottom-end" enterDelay={500}>
      {children}
    </Tooltip>
  );
}
