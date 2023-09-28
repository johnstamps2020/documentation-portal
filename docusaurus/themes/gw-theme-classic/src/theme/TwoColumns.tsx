import React from 'react';
import Box from '@mui/material/Box';

export default function TwoColumns({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Box
      sx={{
        display: { md: 'flex', sm: 'block' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}
    >
      {children}
    </Box>
  );
}
