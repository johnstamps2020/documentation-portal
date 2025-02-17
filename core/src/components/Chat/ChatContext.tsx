import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConsentStore } from '../../stores/consentStore';
import {
  ChatbotComment,
  ChatbotFilters,
  ChatbotMessage,
  ChatbotRequest,
  ChatbotResponse,
  FilterName,
} from '../../types/chatbot';
import { UserInfo } from '../../types/user';
import { postNewComment } from './ChatFeedback/api';

export type ChatItem = {
  chatRequest: ChatbotRequest;
  chatResponse: ChatbotMessage;
  chatComment?: ChatbotComment;
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
  conversationMeta: {
    id: string;
  };
  startNewConversation: () => void;
}

export const ChatContext = createContext<ChatInterface | null>(null);

type ChatProviderProps = { children: React.ReactNode; userInfo: UserInfo };

export function ChatProvider({ children, userInfo }: ChatProviderProps) {
  const defaultFilters: ChatbotFilters = {
    language: 'en',
  };

  const defaultMeta = {
    id: `${userInfo.id}-${new Date().getTime()}`,
  };

  if (!userInfo.isLoggedIn) {
    defaultFilters['public'] = 'true';
  }

  const aiConsented = useConsentStore((state) => state.aiConsented);
  const [items, setItems] = useState<ChatInterface['items']>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [conversationMeta, setConversationMeta] =
    useState<ChatInterface['conversationMeta']>(defaultMeta);
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

  function startNewConversation() {
    setItems([]);
    setConversationMeta(defaultMeta);
  }

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

    const conversation_history = items
      .map(({ chatRequest, chatResponse }) => {
        const question = chatRequest.query;
        const answer = chatResponse.message;

        if (!question || !answer) {
          return undefined;
        }

        return {
          question,
          answer,
        };
      })
      .filter((item) => item !== undefined);

    const chatbotRequest: ChatbotRequest = {
      query: userPrompt,
      opt_in: aiConsented,
      ...filters,
      conversation_history,
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
      const responseFromChatbotAPI = (await response.json()) as ChatbotResponse;
      const endTime = new Date().getTime();
      const responseFromBot = aiConsented
        ? responseFromChatbotAPI.response
        : undefined;

      const chatbotMessage: ChatbotMessage = {
        role: 'bot',
        message: responseFromBot,
        sources: responseFromChatbotAPI.original_documents,
        millisecondsItTook: endTime - startTime,
      };
      const { postedComment } = await postNewComment(
        chatbotRequest,
        chatbotMessage,
        'unset',
        conversationMeta.id,
        userInfo.hasGuidewireEmail
          ? userInfo.email
          : 'not an employee, email not stored'
      );

      setItems((prevItems) => [
        ...prevItems.slice(0, -1),
        {
          chatRequest: chatbotRequest,
          chatResponse: chatbotMessage,
          chatComment: postedComment,
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
        conversationMeta,
        startNewConversation,
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
