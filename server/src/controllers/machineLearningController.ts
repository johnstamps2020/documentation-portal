import { ChatbotRequest, ChatbotResponse } from '@doctools/core';
import 'dotenv/config';
import { winstonLogger } from './loggerController';

// TODO: consider moving this definition to an environment variable
const gwChatbotDomain = 'https://gwgptapi.guidewire.com';
const chatbotUrl = `${gwChatbotDomain}/doc_search/`;
const chatbotTokenUrl = `${gwChatbotDomain}/generate_token/`;

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
    } else {
      winstonLogger.error(
        `CANNOT FETCH FROM gwgptapi ${response}, ${JSON.stringify(response)}`
      );
    }
    return null;
  } catch (err) {
    winstonLogger.error(`Error while trying to fetch from gwgptapi ${err}`);
    return null;
  }
}

async function getChatbotToken() {
  try {
    const clientId = process.env.GW_GPT_CLIENT_ID || '';
    const clientSecret = process.env.GW_GPT_CLIENT_SECRET || '';

    const response = await fetch(chatbotTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'client-id': clientId,
        'client-secret': clientSecret,
      },
    });

    if (response.ok) {
      const responseBody = await response.json();

      return responseBody.access_token;
    } else {
      winstonLogger.error(
        `Cannot fetch TOKEN from gwgptapi ${response}, ${JSON.stringify(
          response
        )}`
      );
    }
    return null;
  } catch (error) {
    winstonLogger.error(
      `Error while getting chatbot token from gwgptapi ${error}`
    );
  }
}

export async function sendChatPrompt(
  requestBody: ChatbotRequest
): Promise<ChatbotResponse> {
  try {
    const token = await getChatbotToken();
    const response = await fetch(chatbotUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        token,
      },
    });

    if (response.ok) {
      const body = (await response.json()) as ChatbotResponse;
      return body;
    }

    const problemMessage = `Error! Could not complete chat transaction! ${JSON.stringify(
      response
    )}`;
    winstonLogger.error(problemMessage);
    return {
      response: problemMessage,
      original_documents: [],
    };
  } catch (err) {
    const errorMessage = `Fatal error while attempting a chat transaction! Chatbot Error: ${err}`;
    winstonLogger.error(errorMessage);
    return {
      response: errorMessage,
      original_documents: [],
    };
  }
}
