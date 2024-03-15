import express, { NextFunction, Request, Response } from 'express';
import { sendChatPrompt } from '../controllers/machineLearningController';
import { ApiResponse, ChatbotRequest } from '../types';

const router = express.Router();

router.post(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    const { text } = req.body as ChatbotRequest;

    if (!text) {
      const result: ApiResponse = {
        status: 400,
        body: {
          message: `Invalid request. Please provide a text field in the request body.`,
        },
      };

      return res.status(result.status).json(result.body);
    }

    const chatbotResponse = await sendChatPrompt(text);

    return res.status(200).json(chatbotResponse);
  }
);

module.exports = router;
