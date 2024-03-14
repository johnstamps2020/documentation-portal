import { ChatbotMessage } from '@doctools/server';
import { createContext, useContext, useState } from 'react';

interface ChatInterface {
  messages: ChatbotMessage[];
  sendPrompt(userPrompt: string): void;
  isProcessing: boolean;
}

export const ChatContext = createContext<ChatInterface | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatInterface['messages']>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendPrompt = async (userPropmt: string) => {
    setIsProcessing(true);
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
      const message = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', message: userPropmt },
        message,
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
