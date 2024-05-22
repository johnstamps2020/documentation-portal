import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useChat } from './ChatContext';

export function ChatLoader() {
  const { isProcessing } = useChat();

  if (!isProcessing) {
    return null;
  }

  return <CircularProgress color="primary" />;
}
