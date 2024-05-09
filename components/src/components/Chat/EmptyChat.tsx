import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Translate } from '../../lib';
import { useConsentStore } from '../Avatar/consentStore';
import { ChatInputBox } from './ChatInputBox';
import { NotOptedIn } from './NotOptedIn';

export function EmptyChat() {
  const aiConsented = useConsentStore((state) => state.aiConsented);
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1" textAlign="center">
        <Translate id="chat.introMessage">
          Ask a question about Guidewire docs
        </Translate>
      </Typography>
      <ChatInputBox />
      {!aiConsented && <NotOptedIn />}
    </Stack>
  );
}
