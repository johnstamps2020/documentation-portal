import { ChatbotDocument } from '@doctools/server';

export type ChatbotMessage = {
  message: string;
  role: 'user' | 'bot';
  sources?: ChatbotDocument[];
};
