import {
  ChatbotResponse,
  ChatbotRequest,
  UserInfo,
  ChatbotFilters,
  FilterName,
} from '@doctools/server';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChatbotMessage } from './types';

export const AI_OPT_IN_KEY_IN_LOCAL_STORAGE = 'ai-consent-decision';

export interface ChatInterface {
  optedIn: boolean;
  applyOptedIn: (valueToApply: ChatInterface['optedIn']) => void;
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

export function checkAIOptInStatus(): ChatInterface['optedIn'] {
  const valueInLocalStorage = localStorage.getItem(
    AI_OPT_IN_KEY_IN_LOCAL_STORAGE
  );

  if (valueInLocalStorage) {
    return valueInLocalStorage === 'true';
  }
  return false;
}

export function saveAIOptInStatus(valueToSave: ChatInterface['optedIn']): void {
  const valueInLocalStorage = localStorage.getItem(
    AI_OPT_IN_KEY_IN_LOCAL_STORAGE
  );

  if (valueInLocalStorage !== valueToSave.toString()) {
    localStorage.setItem(
      AI_OPT_IN_KEY_IN_LOCAL_STORAGE,
      valueToSave.toString()
    );
  }
}

export function ChatProvider({ children, userInfo }: ChatProviderProps) {
  const defaultFilters: ChatbotFilters = {
    language: 'en',
  };

  if (!userInfo.isLoggedIn) {
    defaultFilters['public'] = 'true';
  }

  const [optedIn, setOptedIn] = useState<ChatInterface['optedIn']>(
    checkAIOptInStatus()
  );
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
    setIsProcessing(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', message: userPrompt },
    ]);
    const chatbotRequest: ChatbotRequest = {
      query: userPrompt,
      opt_in: optedIn,
      ...filters,
    };
    console.log({ chatbotRequest });
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
      const responseFromBot = optedIn ? chatbotResponse.response : undefined;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'bot',
          message: responseFromBot,
          sources: chatbotResponse.original_documents,
        },
      ]);
    }
    setIsProcessing(false);
  };

  const applyOptedIn: ChatInterface['applyOptedIn'] = (valueToApply) => {
    saveAIOptInStatus(valueToApply);
    setOptedIn(valueToApply);
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
        optedIn,
        applyOptedIn,
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
