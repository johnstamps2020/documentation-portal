import React from 'react';
import Typography from '@mui/material/Typography';
import { Translate } from '../../lib';

export function GwEmployeeLoginText() {
  return (
    <Typography sx={{ marginTop: '0.5rem' }}>
      <Translate id="login.gwEmployeeHint">
        Guidewire employee? Log in using the Guidewire Cloud option above.
      </Translate>
    </Typography>
  );
}
