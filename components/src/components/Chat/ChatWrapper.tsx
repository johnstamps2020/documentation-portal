import React from 'react';
import { useChat } from './ChatContext';
import { ChatList } from './ChatList';
import { EmptyChat } from './EmptyChat';

export function ChatWrapper() {
  const { items, isProcessing } = useChat();

  if (items.length === 0 && !isProcessing) {
    return <EmptyChat />;
  }

  return <ChatList />;
}
