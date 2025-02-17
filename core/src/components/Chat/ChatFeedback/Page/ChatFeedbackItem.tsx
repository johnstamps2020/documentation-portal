import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ChatbotComment } from '../../../../types';
import { ThumbDownIcon, ThumbUpIcon, HourglassBottomIcon } from '../icons';
import { ChatResponseAccordion } from './ChatResponseAccordion';
import { UserQueryAccordion } from './UserQueryAccordion';
import { UserInfoBox } from './UserInfoBox';
import { ArchiveButton } from './ArchiveButton';
import { DateDisplay } from './DateDisplay';

type ChatFeedbackItemProps = ChatbotComment;

export function ChatFeedbackItem(props: ChatFeedbackItemProps) {
  const { context, status, user } = props;

  return (
    <Card
      sx={{
        p: 4,
        mb: 3,
      }}
      elevation={6}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 2 }}>
        {user.reaction === 'positive' && <ThumbUpIcon />}
        {user.reaction === 'negative' && <ThumbDownIcon />}
        {user.reaction === 'unset' && <HourglassBottomIcon />}
        <Typography variant="h2" sx={{ p: 0 }}>
          {!user.comment && '<no user reaction>'}
          {user.comment?.slice(0, 100)}
          {user.comment && user.comment.length > 100 ? '...' : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          color={status === 'active' ? 'success' : 'default'}
          label={status}
        />
        <DateDisplay milliseconds={context.date} />
        {context.chatbotMessage.millisecondsItTook && (
          <Typography>
            Elapsed time: {context.chatbotMessage.millisecondsItTook / 1000}s
          </Typography>
        )}
      </Box>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mt: 2 }}
      >
        <Box>
          <UserQueryAccordion {...context.chatbotRequest} />
        </Box>
        <Box>
          <ChatResponseAccordion {...context.chatbotMessage} />
        </Box>
      </Box>
      <UserInfoBox {...user} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <ArchiveButton item={props} />
      </Box>
    </Card>
  );
}
