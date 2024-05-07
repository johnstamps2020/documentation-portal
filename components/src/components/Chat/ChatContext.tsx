import {
  ChatbotResponse,
  ChatbotRequest,
  UserInfo,
  ChatbotFilters,
  FilterName,
} from '@doctools/server';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChatbotMessage } from './types';

export interface ChatInterface {
  messages: ChatbotMessage[];
  isProcessing: boolean;
  sendPrompt(userPrompt: string): void;
  filters: ChatbotFilters;
  updateFilters: (name: FilterName, value: string[]) => void;
  getFilterValues: (name: FilterName) => string[];
  filterCount: number;
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
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] =
    useState<ChatInterface['filters']>(defaultFilters);

  useEffect(() => {
    const allFilters = [];
    const filtersToCount: FilterName[] = [
      'platform',
      'product',
      'release',
      'subject',
      'version',
    ];
    for (const filterName of filtersToCount) {
      allFilters.push(...getFilterValues(filterName));
    }

    const numberOfFilters = allFilters.length;

    if (filterCount !== numberOfFilters) {
      setFilterCount(numberOfFilters);
    }
  }, [filters]);

  const updateFilters: ChatInterface['updateFilters'] = (name, value) => {
    setFilters((currentFilters) => {
      return {
        ...currentFilters,
        [name]: value.join(','),
      };
    });
  };

  const getFilterValues: ChatInterface['getFilterValues'] = (name) => {
    const splitValues = filters[name]
      ?.split(',')
      .filter((value) => value.length > 0);

    return splitValues || [];
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
      value={{
        messages,
        sendPrompt,
        isProcessing,
        filters,
        updateFilters,
        getFilterValues,
        filterCount,
      }}
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
