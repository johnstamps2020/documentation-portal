import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { translate } from '../../lib';
import { ChatLoader } from './ChatLoader';
import './ChatMessage.css';
import ChatSources from './ChatSources';
import { ChatbotMessage } from './types';

type ChatMessageProps = ChatbotMessage & {
  isLast: boolean;
};

function UserMessage({ message, isLast }: ChatMessageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLast && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLast]);

  return (
    <Stack direction="row" sx={{ gap: 2 }}>
      {isLast && <ChatLoader />}
      <Typography variant="h2" fontSize="30px" width="100%" ref={wrapperRef}>
        {message}
      </Typography>
    </Stack>
  );
}

export function ChatMessage({
  role,
  message,
  isLast,
  sources,
}: ChatMessageProps) {
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (role === 'user') {
    return <UserMessage message={message} isLast={isLast} role="user" />;
  }

  return (
    <Box sx={{ width: '100%' }} ref={responseRef}>
      <ChatSources sources={sources} />
      <Typography variant="h3">
        {translate({
          id: 'chat.answer',
          message: 'Answer',
        })}
      </Typography>
      <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
    </Box>
  );
}
