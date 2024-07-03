import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState } from 'react';
import {
  FeedbackFilters,
  useChatbotFeedback,
} from '../../../../hooks/useChatbotFeedback';
import { ChatFeedbackItem } from './ChatFeedbackItem';
import { LoaderBackdrop } from './LoaderBackdrop';
import { Tally } from './Tally';
import { DownloadButton } from './DownloadButton';

export function ChatFeedbackPage() {
  const [filters, setFilters] = useState<FeedbackFilters>({
    status: ['active'],
    userReaction: ['positive', 'negative'],
  });

  const { isError, isLoading, feedbackItems } = useChatbotFeedback(filters);

  if (isError) {
    return (
      <Alert severity="error">
        <pre>
          <code>{isError}</code>
        </pre>
      </Alert>
    );
  }

  if (isLoading) {
    return <LoaderBackdrop />;
  }

  function toggleArchived() {
    setFilters((currentFilters) => {
      if (currentFilters.status?.includes('archived')) {
        return {
          ...currentFilters,
          status: ['active'],
        };
      }

      return {
        ...currentFilters,
        status: ['active', 'archived'],
      };
    });
  }

  function toggleUnset() {
    setFilters((currentFilters) => {
      if (currentFilters.userReaction?.includes('unset')) {
        const filteredReaction = currentFilters.userReaction.filter(
          (r) => r !== 'unset'
        );
        return {
          ...currentFilters,
          userReaction: [...filteredReaction],
        };
      }

      const copyOfReactions = currentFilters.userReaction || [];
      const extendedReactions: FeedbackFilters['userReaction'] = [
        ...copyOfReactions,
        'unset',
      ];
      return {
        ...currentFilters,
        userReaction: extendedReactions,
      };
    });
  }

  return (
    <>
      {isLoading && <LoaderBackdrop />}
      <h1>Feedback about the chatbot</h1>
      <Tally />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', m: 2 }}>
        <FormControlLabel
          control={<Checkbox />}
          label="Include archived items"
          checked={filters.status?.includes('archived')}
          onChange={toggleArchived}
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Include items without user reaction"
          checked={filters.userReaction?.includes('unset')}
          onChange={toggleUnset}
        />
        <DownloadButton items={feedbackItems || []} />
      </Box>
      {feedbackItems?.map((item) => (
        <ChatFeedbackItem {...item} key={item.id} />
      ))}
    </>
  );
}
