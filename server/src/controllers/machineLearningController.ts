import { ChatbotRequest, ChatbotResponse } from '../types';
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
  requestBody: ChatbotRequest
): Promise<ChatbotResponse> {
  try {
    console.log('Requesting', { requestBody });
    const response = await fetch(`${chatbotUrl}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const body = (await response.json()) as ChatbotResponse;
      console.log({ body });
      return body;
    }
    return {
      response: `Error! Could not complete chat transaction! ${JSON.stringify(
        response
      )}`,
      original_documents: [],
    };
  } catch (err) {
    winstonLogger.error(err);
    return { response: `Error ${err}`, original_documents: [] };
  }
}
