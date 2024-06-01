import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';
import { TermsAndConditionsDialogBox } from './TermsAndConditionsDialogBox';

export function NotOptedIn() {
  const [open, setOpen] = useState(false);
  const setAIConsented = useConsentStore((state) => state.setAIConsented);
  const aiConsented = useConsentStore((state) => state.aiConsented);

  if (aiConsented) {
    return null;
  }

  return (
    <Box>
      <Typography sx={{ my: 2 }}>
        <Translate id="chat.notOptedIn">
          You did not opt in to receive messages from the chatbot.
        </Translate>
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setAIConsented(true);
        }}
      >
        <Translate id="chat.allow">
          Allow AI chatbot to answer questions
        </Translate>
      </Button>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        <Translate id="chat.allow.learnMore">
          Read the terms and conditions
        </Translate>
      </Button>
      <TermsAndConditionsDialogBox
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
}