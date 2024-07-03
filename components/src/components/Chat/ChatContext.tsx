import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConsentStore } from '../../stores/consentStore';
import {
  ChatbotFilters,
  ChatbotMessage,
  ChatbotRequest,
  ChatbotResponse,
  FilterName,
} from '../../types/chatbot';
import { UserInfo } from '../../types/user';

export type ChatItem = {
  chatRequest: ChatbotRequest;
  chatResponse: ChatbotMessage;
};

export interface ChatInterface {
  items: ChatItem[];
  isProcessing: boolean;
  sendPrompt(userPrompt: string): void;
  filters: ChatbotFilters;
  updateFilters: (name: FilterName, value: string[]) => void;
  getFilterValues: (name: FilterName) => string[];
  filterCount: number;
  userInfo: UserInfo;
}

export const ChatContext = createContext<ChatInterface | null>(null);

type ChatProviderProps = { children: React.ReactNode; userInfo: UserInfo };

export function ChatProvider({ children, userInfo }: ChatProviderProps) {
  const defaultFilters: ChatbotFilters = {
    language: 'en',
  };

  if (!userInfo.isLoggedIn) {
    defaultFilters['public'] = 'true';
  }

  const aiConsented = useConsentStore((state) => state.aiConsented);
  const [items, setItems] = useState<ChatInterface['items']>([]);
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
      if (value.length === 0 && currentFilters[name] !== undefined) {
        const copyOfCurrentFilters = { ...currentFilters };
        delete copyOfCurrentFilters[name];

        return copyOfCurrentFilters;
      }
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
    const startTime = new Date().getTime();
    setIsProcessing(true);

    const chatbotRequest: ChatbotRequest = {
      query: userPrompt,
      opt_in: aiConsented,
      ...filters,
    };

    setItems((prevItems) => [
      ...prevItems,
      {
        chatRequest: chatbotRequest,
        chatResponse: {
          message: undefined,
          role: 'bot',
          millisecondsItTook: 0,
        },
      },
    ]);

    const response = await fetch('/chatbot', {
      method: 'POST',
      body: JSON.stringify(chatbotRequest),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error({ response });
    } else {
      const chatbotResponse = (await response.json()) as ChatbotResponse;
      const endTime = new Date().getTime();
      const responseFromBot = aiConsented
        ? chatbotResponse.response
        : undefined;
      setItems((prevItems) => [
        ...prevItems.slice(0, -1),
        {
          chatRequest: chatbotRequest,
          chatResponse: {
            role: 'bot',
            message: responseFromBot,
            sources: chatbotResponse.original_documents,
            millisecondsItTook: endTime - startTime,
          },
        },
      ]);
    }
    setIsProcessing(false);
  };

  return (
    <ChatContext.Provider
      value={{
        items,
        sendPrompt,
        isProcessing,
        filters,
        updateFilters,
        getFilterValues,
        filterCount,
        userInfo,
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
