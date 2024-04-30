import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useChat } from './ChatContext';
import { translate } from '../../lib';

export function ChatInputBox() {
  const { sendPrompt, isProcessing } = useChat();
  const [userPropmt, setUserPrompt] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserPrompt(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendPrompt(userPropmt);
    setUserPrompt('');
  }

  return (
    <>
      <Stack
        direction="row"
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%', padding: '2rem', gap: 2 }}
      >
        <TextField
          hiddenLabel
          fullWidth
          autoComplete="off"
          maxRows={5}
          value={userPropmt}
          onChange={handleChange}
          disabled={isProcessing}
        />
        <IconButton
          disabled={isProcessing || userPropmt === ''}
          aria-label={translate({
            id: 'chat.send',
            message: 'Send',
          })}
          type="submit"
        >
          <SendIcon />
        </IconButton>
      </Stack>
    </>
  );
}
