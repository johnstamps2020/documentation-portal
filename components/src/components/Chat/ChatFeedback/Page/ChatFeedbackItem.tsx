import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ChatbotComment } from '../../../../types';
import { ThumbDownIcon, ThumbUpIcon } from '../icons';
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
        {user.reaction === 'positive' ? <ThumbUpIcon /> : <ThumbDownIcon />}
        <Typography variant="h2" sx={{ p: 0 }}>
          {user.comment?.slice(0, 300)}
          {user.comment && user.comment.length > 300 ? '...' : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          color={status === 'active' ? 'success' : 'default'}
          label={status}
        />
        <DateDisplay milliseconds={context.date} />
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ArchiveButton item={props} />
      </Box>
    </Card>
  );
}
