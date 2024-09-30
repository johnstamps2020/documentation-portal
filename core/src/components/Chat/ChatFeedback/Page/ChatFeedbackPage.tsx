import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import {
  FeedbackFilters,
  useChatbotFeedback,
} from '../../../../hooks/useChatbotFeedback';
import { ChatFeedbackItem } from './ChatFeedbackItem';
import { DownloadButton } from './DownloadButton';
import { LoaderBackdrop } from '../../../LoaderBackdrop';
import { Tally } from './Tally';

export function ChatFeedbackPage() {
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = useState<FeedbackFilters>({
    status: ['active'],
    userReaction: ['positive', 'negative'],
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  function handleChange(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

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

  if (!feedbackItems) {
    return <div>No feedback</div>;
  }

  const pageLength = 10;
  const pageCount = Math.ceil((feedbackItems.length || 0) / pageLength);
  const start = (page - 1) * pageLength;
  const end = start + pageLength;

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          my: 4,
        }}
      >
        {feedbackItems && pageCount > 1 && (
          <Pagination count={pageCount} page={page} onChange={handleChange} />
        )}
        {feedbackItems?.slice(start, end).map((item) => (
          <ChatFeedbackItem {...item} key={item.id} />
        ))}
        {feedbackItems && pageCount > 1 && (
          <Pagination count={pageCount} page={page} onChange={handleChange} />
        )}
      </Box>
    </>
  );
}
