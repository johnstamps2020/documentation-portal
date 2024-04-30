import { ChatbotResponse, ChatbotRequest, UserInfo } from '@doctools/server';
import React, { createContext, useContext, useState } from 'react';
import { answer, question } from './chatDebug';
import { ChatbotMessage } from './types';

interface ChatInterface {
  messages: ChatbotMessage[];
  isProcessing: boolean;
  sendPrompt(userPrompt: string): void;
}

export const ChatContext = createContext<ChatInterface | null>(null);

type ChatProviderProps = { children: React.ReactNode; userInfo: UserInfo };

export function ChatProvider({ children, userInfo }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatInterface['messages']>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendPrompt = async (userPropmt: string) => {
    setIsProcessing(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', message: userPropmt },
    ]);
    const chatbotRequest: ChatbotRequest = {
      query: userPropmt,
      opt_in: true,
    };
    const response = await fetch('/chatbot', {
      method: 'POST',
      body: JSON.stringify(chatbotRequest),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const chatbotResponse = (await response.json()) as ChatbotResponse;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: chatbotResponse.response,
          sources: chatbotResponse.original_documents,
        },
      ]);
    }
    setIsProcessing(false);
  };

  return (
    <ChatContext.Provider value={{ messages, sendPrompt, isProcessing }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
