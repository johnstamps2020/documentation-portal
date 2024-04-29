import { ChatbotMessage, ChatbotResponse } from '@doctools/server';
import React, { createContext, useContext, useState } from 'react';
import { answer, question } from './chatDebug';

interface ChatInterface {
  messages: ChatbotMessage[];
  isProcessing: boolean;
  sendPrompt(userPrompt: string): void;
  loadDebugMessages(): void;
}

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
    const response = await fetch('/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        text: userPropmt,
      }),
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
