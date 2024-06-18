import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Translate } from '../../lib';
import { ChatInputBox } from './ChatInputBox';
import { NotOptedIn } from './NotOptedIn';

export function EmptyChat() {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        paddingTop: 8,
      }}
    >
      <Typography variant="h1" textAlign="center">
        <Translate id="chat.introMessage">
          Ask a question about Guidewire docs
        </Translate>
      </Typography>
      <ChatInputBox />
      <NotOptedIn />
    </Stack>
  );
}
