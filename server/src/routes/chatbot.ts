import express, { NextFunction, Request, Response } from 'express';
import { sendChatPrompt } from '../controllers/machineLearningController';
import { ApiResponse, ChatbotRequest } from '../types';

const router = express.Router();

router.post(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    const body: ChatbotRequest = req.body;
    const { query } = body;

    if (!query) {
      const result: ApiResponse = {
        status: 400,
        body: {
          message: `Invalid request. Please provide a query field in the request body.`,
        },
      };

      return res.status(result.status).json(result.body);
    }

    const chatbotResponse = await sendChatPrompt(body);

    return res.status(200).json(chatbotResponse);
  }
);

module.exports = router;
