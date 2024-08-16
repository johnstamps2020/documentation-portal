import Button from '@mui/material/Button';
import React from 'react';
import { useChat } from './ChatContext';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export function ChatReset() {
  const { startNewConversation } = useChat();
  return (
    <Button
      onClick={() => startNewConversation()}
      startIcon={<ChatBubbleOutlineIcon />}
    >
      Start new chat
    </Button>
  );
}
