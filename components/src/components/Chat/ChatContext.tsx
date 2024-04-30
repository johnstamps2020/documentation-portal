import {
  ChatbotResponse,
  ChatbotRequest,
  UserInfo,
  ChatbotFilters,
} from '@doctools/server';
import React, { createContext, useContext, useState } from 'react';
import { ChatbotMessage } from './types';

interface ChatInterface {
  messages: ChatbotMessage[];
  isProcessing: boolean;
  sendPrompt(userPrompt: string): void;
  filters: ChatbotFilters;
  updateFilters: (name: string, value: string) => void;
}

export const ChatContext = createContext<ChatInterface | null>(null);

type ChatProviderProps = { children: React.ReactNode; userInfo: UserInfo };

export function ChatProvider({ children, userInfo }: ChatProviderProps) {
  const defaultFilters: ChatbotFilters = {
    doc_title: '',
    internal: userInfo.hasGuidewireEmail ? 'true' : 'false',
    public: userInfo.isLoggedIn ? undefined : 'true',
    language: 'en',
    platform: '',
    product: '',
    release: '',
    subject: '',
    version: '',
  };
  const [messages, setMessages] = useState<ChatInterface['messages']>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] =
    useState<ChatInterface['filters']>(defaultFilters);

  const updateFilters: ChatInterface['updateFilters'] = (
    name: string,
    value: string
  ) => {
    setFilters((currentFilters) => {
      return {
        ...currentFilters,
        [name]: value,
      };
    });
  };

  const sendPrompt = async (userPrompt: string) => {
    setIsProcessing(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', message: userPrompt },
    ]);
    const chatbotRequest: ChatbotRequest = {
      query: userPrompt,
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
    <ChatContext.Provider
      value={{ messages, sendPrompt, isProcessing, filters, updateFilters }}
    >
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
