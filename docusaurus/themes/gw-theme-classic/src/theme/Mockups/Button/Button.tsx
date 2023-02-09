import React from 'react';
import Button from '@mui/material/Button';

const commonStyles: React.CSSProperties = {
  textTransform: 'none',
};

export function ContainedButton({ children }) {
  return (
    <Button
      variant="contained"
      sx={{ ...commonStyles, backgroundColor: '#00729C' }}
    >
      {children}
    </Button>
  );
}

export function TextButton({ children }) {
  return (
    <Button variant="text" sx={commonStyles}>
      {children}
    </Button>
  );
}
