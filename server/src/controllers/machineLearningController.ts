import { ChatbotMessage } from '../types';
import { winstonLogger } from './loggerController';

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

export async function sendChatPrompt(text: string): Promise<ChatbotMessage> {
  try {
    const response = await fetch(`${process.env.ML_TRANSFORMER_URL}/chatbot`, {
      method: 'POST',
      body: JSON.stringify({
        text,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return {
      message: `Error! Could not complete chat transaction! ${JSON.stringify(
        response
      )}`,
    };
  } catch (err) {
    winstonLogger.error(err);
    return { message: `Error ${err}` };
  }
}
