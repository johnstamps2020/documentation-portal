import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatInputBox } from './ChatInputBox';
import { Translate } from '../../lib';
import { useChat } from './ChatContext';
import { NotOptedIn } from './NotOptedIn';

export function EmptyChat() {
  const { optedIn } = useChat();
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
      {!optedIn && <NotOptedIn />}
    </Stack>
  );
}
