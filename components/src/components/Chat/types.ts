import { ChatbotDocument } from '@doctools/server';

export type ChatbotMessage = {
  message: string | undefined;
  role: 'user' | 'bot';
  sources?: ChatbotDocument[];
};
