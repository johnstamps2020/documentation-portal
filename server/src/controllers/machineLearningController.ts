import { ChatbotMessage, ChatbotRequest } from '../types';
import { winstonLogger } from './loggerController';

// TODO: consider moving this definition to an environment variable
const chatbotUrl = 'https://gwgptapi.guidewire.com/doc_search/';

export async function createVectorFromText(
  text: string
): Promise<number[] | null> {
  try {
    const response = await fetch(`${process.env.ML_TRANSFORMER_URL}/encode`, {
      method: 'POST',
      body: JSON.stringify({
        text: text,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    winstonLogger.error(err);
    return null;
  }
}

export async function sendChatPrompt(
  chatbotRequest: ChatbotRequest
): Promise<ChatbotMessage> {
  try {
    const response = await fetch(`${chatbotUrl}/chat`, {
      method: 'POST',
      body: JSON.stringify(chatbotRequest),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log({ response });
    if (response.ok) {
      return await response.json();
    }
    return {
      answer: `Error! Could not complete chat transaction! ${JSON.stringify(
        response
      )}`,
      sources: [],
    };
  } catch (err) {
    winstonLogger.error(err);
    return { answer: `Error ${err}`, sources: [] };
  }
}
