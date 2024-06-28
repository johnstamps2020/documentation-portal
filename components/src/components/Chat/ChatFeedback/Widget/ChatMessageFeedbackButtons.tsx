import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { ThumbUpIcon, ThumbDownIcon } from '../icons';
import IconButton from '@mui/material/IconButton';
import { translate } from '../../../../lib';
import {
  ChatbotComment,
  ChatbotMessage,
  ChatbotRequest,
} from '../../../../types';
import { ChatMessageFeedbackDialog } from './ChatMessageFeedbackDialog';
import { postNewComment } from '../api';

type ChatMessageFeedbackButtonsProps = {
  chatbotRequest: ChatbotRequest;
  chatbotMessage: ChatbotMessage;
};

export function ChatMessageFeedbackButtons({
  chatbotMessage,
  chatbotRequest,
}: ChatMessageFeedbackButtonsProps) {
  const [isOpen, setOpen] = useState(false);
  const [reaction, setReaction] =
    useState<ChatbotComment['user']['reaction']>('positive');
  const [commentAlreadyPosted, setCommentAlreadyPosted] = useState<
    ChatbotComment | undefined
  >(undefined);

  async function handleClick(
    clickReaction: ChatbotComment['user']['reaction']
  ) {
    setReaction(clickReaction);
    const { postedComment } = await postNewComment(
      chatbotRequest,
      chatbotMessage,
      clickReaction
    );
    setCommentAlreadyPosted(postedComment);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
    >
      <IconButton
        aria-label={translate({
          id: 'chatbot.feedback.thumbsUp',
          message: 'This chatbot response is great',
        })}
        onClick={() => handleClick('positive')}
      >
        <ThumbUpIcon />
      </IconButton>
      <IconButton
        aria-label={translate({
          id: 'chatbot.feedback.thumbsDown',
          message: 'This chatbot response needs improvement',
        })}
        onClick={() => handleClick('negative')}
      >
        <ThumbDownIcon />
      </IconButton>
      <ChatMessageFeedbackDialog
        open={isOpen}
        onClose={handleClose}
        reaction={reaction}
        chatbotComment={commentAlreadyPosted}
      />
    </Box>
  );
}
