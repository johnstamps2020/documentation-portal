import React from 'react';
import { useChat } from './ChatContext';
import { ChatList } from './ChatList';
import { EmptyChat } from './EmptyChat';

export function ChatWrapper() {
  const { messages } = useChat();

  if (messages.length === 0) {
    return <EmptyChat />;
  }

  return <ChatList />;
}
