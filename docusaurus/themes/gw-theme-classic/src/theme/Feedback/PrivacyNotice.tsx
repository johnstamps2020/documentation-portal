import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Translate from '@theme/Translate';
import React from 'react';

export default function PrivacyNotice() {
  return (
    <Box>
      <Typography>
        <Translate id="privacy.warning">
          By providing your e-mail address, you consent to being contacted by
          Guidewire.
        </Translate>{' '}
        <a
          href="https://www.guidewire.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Translate id="privacy.link">
            Guidewire's Privacy Policy can be found here.
          </Translate>
        </a>
      </Typography>
    </Box>
  );
}
