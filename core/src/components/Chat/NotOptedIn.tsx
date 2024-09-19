import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';
import { TermsAndConditionsDialogBox } from './TermsAndConditionsDialogBox';

export function NotOptedIn() {
  const [open, setOpen] = useState(false);
  
  const aiConsented = useConsentStore((state) => state.aiConsented);

  if (aiConsented) {
    return null;
  }

  return (
    <Stack>
      <Typography sx={{ my: 2 }}>
        <Translate id="chat.notOptedIn">
          Click below to opt-in to answers from the Guidewire Docs AI chatbot.
        </Translate>
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Translate id="chat.allow">
          Allow AI chatbot to answer questions
        </Translate>
      </Button>
      <TermsAndConditionsDialogBox
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
    </Stack>
  );
}
