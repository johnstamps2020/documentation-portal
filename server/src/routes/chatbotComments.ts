import { ChatbotComment } from '@doctools/core';
import express, { Request, Response } from 'express';
import {
  deleteAllChatbotComments,
  getChatbotComments,
  submitChatbotComment,
} from '../controllers/chatbotCommentController';

const router = express.Router();

router.post('/', async function (req: Request, res: Response) {
  const comment: ChatbotComment = req.body;
  const { status, body } = await submitChatbotComment(comment);

  return res.status(status).send(body);
});

router.get('/', async function (req: Request, res: Response) {
  const { status, body } = await getChatbotComments();

  return res.status(status).send(body);
});

router.delete('/', async function (req: Request, res: Response) {
  const { status, body } = await deleteAllChatbotComments();

  return res.status(status).send(body);
});

export default router;
