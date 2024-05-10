import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Translate, translate } from '../../lib';
import { ChatLoader } from './ChatLoader';
import './ChatMessage.css';
import ChatSources from './ChatSources';
import { ChatbotMessage } from './types';
import { NotOptedIn } from './NotOptedIn';
import { useConsentStore } from '../Avatar/consentStore';

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

function Answer({ answer }: { answer: string }) {
  return (
    <>
      <Typography variant="h3">
        {translate({
          id: 'chat.answer',
          message: 'Answer',
        })}
      </Typography>
      <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
    </>
  );
}

export function ChatMessage({
  role,
  message,
  isLast,
  sources,
}: ChatMessageProps) {
  const responseRef = useRef<HTMLDivElement>(null);
  const aiConsented = useConsentStore((state) => state.aiConsented);

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
      {message && aiConsented && <Answer answer={message} />}
      <NotOptedIn />
    </Box>
  );
}
