import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type HeroCenteredProps = {
  children: React.ReactNode;
  additionalStyles?: BoxProps['sx'];
};

export default function HeroCentered({
  children,
  additionalStyles,
}: HeroCenteredProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          textAlign: 'center',
          maxWidth: '700px',
          ...additionalStyles,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
