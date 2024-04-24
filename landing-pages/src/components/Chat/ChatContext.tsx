import {
  ChatbotRequest,
  ChatbotResponse,
  ChatbotDocumentMetadataFilters,
} from '@doctools/server';
import { createContext, useContext, useState } from 'react';
import { answer, question } from './chatDebug';

export type ChatMessageProps = {
  role?: 'user' | 'bot';
  message: string;
};

interface ChatInterface {
  messages: ChatMessageProps[];
  isProcessing: boolean;
  sendPrompt(userPrompt: string): void;
  loadDebugMessages(): void;
}

const defaultFilters: ChatbotDocumentMetadataFilters = {
  platform: [],
  product: [],
  version: [],
  release: [],
  subject: [],
  langauge: [],
  internal: false,
  public: false,
  doc_title: '',
};

export const ChatContext = createContext<ChatInterface | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatInterface['messages']>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendPrompt = async (userPropmt: string) => {
    setIsProcessing(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', message: userPropmt },
    ]);
    const chatbotRequest: ChatbotRequest = {
      prompt: userPropmt,
      filters: defaultFilters,
    };
    const response = await fetch('/chatbot', {
      method: 'POST',
      body: JSON.stringify(chatbotRequest),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const message = (await response.json()) as ChatbotResponse;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', message: message.text },
      ]);
    }
    setIsProcessing(false);
  };

  function loadDebugMessages() {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', message: question },
      { role: 'bot', message: answer },
    ]);
  }

  return (
    <ChatContext.Provider
      value={{ messages, sendPrompt, loadDebugMessages, isProcessing }}
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
