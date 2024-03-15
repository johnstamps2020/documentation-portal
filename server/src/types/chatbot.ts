export type ChatbotResponse = {
  text: string;
};

export type ChatbotMessage = {
  role?: 'user' | 'bot';
  message: string;
};

export type ChatbotRequest = {
  text: string;
};
