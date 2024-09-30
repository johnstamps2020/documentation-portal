import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useChatbotFeedback } from '../../../../hooks/useChatbotFeedback';
import { ThumbDownIcon, ThumbUpIcon } from '../icons';

export function Tally() {
  const { isError, isLoading, feedbackItems } = useChatbotFeedback({});

  if (isError || isLoading || !feedbackItems) {
    return null;
  }

  const positive = feedbackItems.filter(
    (item) => item.user.reaction === 'positive'
  ).length;
  const negative = feedbackItems.filter(
    (item) => item.user.reaction === 'negative'
  ).length;

  const archivedItems = feedbackItems.filter(
    (item) => item.status === 'archived'
  );

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Typography>{positive}</Typography>
      <ThumbUpIcon />
      <ThumbDownIcon />
      <Typography>{negative}</Typography>
      <Typography>Total: {feedbackItems.length}</Typography>
      {archivedItems && (
        <Typography>({archivedItems.length} of them are archived)</Typography>
      )}
    </Box>
  );
}
