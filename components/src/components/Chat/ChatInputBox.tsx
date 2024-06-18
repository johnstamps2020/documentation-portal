import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { translate } from '../../lib';
import { useChat } from './ChatContext';
import { ChatFiltersButton } from './ChatFiltersButton';

export function ChatInputBox() {
  const { sendPrompt, isProcessing } = useChat();
  const [userPrompt, setUserPrompt] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserPrompt(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendPrompt(userPrompt);
    setUserPrompt('');
  }

  return (
    <Stack
      direction="row"
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', py: '2rem', gap: 2 }}
    >
      <TextField
        hiddenLabel
        fullWidth
        autoComplete="off"
        maxRows={5}
        value={userPrompt}
        onChange={handleChange}
        disabled={isProcessing}
      />
      <IconButton
        disabled={isProcessing || userPrompt === ''}
        aria-label={translate({
          id: 'chat.send',
          message: 'Send',
        })}
        type="submit"
        color="primary"
      >
        <SendIcon />
      </IconButton>
      <ChatFiltersButton />
    </Stack>
  );
}
