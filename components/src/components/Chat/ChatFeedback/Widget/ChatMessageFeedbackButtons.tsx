import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import { translate } from '../../../../lib';
import { ChatbotComment } from '../../../../types';
import { postComment } from '../api';
import { ThumbDownIcon, ThumbUpIcon } from '../icons';
import { useChatFeedback } from './ChatFeedbackContext';
import { ChatMessageFeedbackDialog } from './ChatMessageFeedbackDialog';

export function ChatMessageFeedbackButtons() {
  const [isOpen, setOpen] = useState(false);
  const { chatComment } = useChatFeedback();
  const [selectedReaction, setSelectedReaction] = useState(
    chatComment.user.reaction
  );

  async function handleClick(
    clickReaction: ChatbotComment['user']['reaction']
  ) {
    setSelectedReaction(clickReaction);
    const commentToPost: ChatbotComment = {
      ...chatComment,
      user: {
        ...chatComment?.user,
        reaction: clickReaction,
      },
    };

    await postComment(commentToPost);
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
        reactionToSave={selectedReaction}
      />
    </Box>
  );
}
