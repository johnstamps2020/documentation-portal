import React, { createContext, useContext } from 'react';
import { ChatbotComment } from '../../../../types';

export interface ChatFeedbackInterface {
  chatComment: ChatbotComment;
}

export const ChatFeedbackContext = createContext<ChatFeedbackInterface | null>(
  null
);

type ChatFeedbackProviderProps = {
  children: React.ReactNode;
  chatComment: ChatFeedbackInterface['chatComment'];
};

export function ChatFeedbackProvider({
  children,
  chatComment,
}: ChatFeedbackProviderProps) {
  return (
    <ChatFeedbackContext.Provider
      value={{
        chatComment,
      }}
    >
      {children}
    </ChatFeedbackContext.Provider>
  );
}

export function useChatFeedback() {
  const context = useContext(ChatFeedbackContext);
  if (!context) {
    throw new Error(
      'useChatFeedback must be used within a ChatFeedbackProvider'
    );
  }
  return context;
}
