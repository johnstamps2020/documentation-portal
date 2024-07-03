import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef } from 'react';
import { translate } from '../../lib';
import { useConsentStore } from '../../stores/consentStore';
import { ChatItem } from './ChatContext';
import { ChatMessageFeedbackButtons } from './ChatFeedback/Widget/ChatMessageFeedbackButtons';
import { ChatLoader } from './ChatLoader';
import ChatSources from './ChatSources';
import { Markdown } from './Markdown';
import { NotOptedIn } from './NotOptedIn';

type ChatMessageProps = ChatItem & {
  isLast: boolean;
};

type UserPromptProps = {
  prompt: string;
  isLast: boolean;
};

function UserPrompt({ prompt, isLast }: UserPromptProps) {
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
        {prompt}
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
      <Markdown contents={answer} />
    </>
  );
}

export function ChatMessage({
  chatRequest,
  chatResponse,
  isLast,
}: ChatMessageProps) {
  const { message, role, sources, millisecondsItTook } = chatResponse;
  const { query } = chatRequest;
  const responseRef = useRef<HTMLDivElement>(null);
  const aiConsented = useConsentStore((state) => state.aiConsented);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (role === 'user') {
    return;
  }

  return (
    <Box sx={{ width: '100%' }} ref={responseRef}>
      <UserPrompt prompt={query} isLast={isLast} />
      {sources && <ChatSources sources={sources} />}
      {message && aiConsented && <Answer answer={message} />}
      {message && (
        <>
          <ChatMessageFeedbackButtons
            chatbotMessage={chatResponse}
            chatbotRequest={chatRequest}
          />
          <Box sx={{ textAlign: 'right' }}>
            Response received after {millisecondsItTook / 1000}s
          </Box>
        </>
      )}
      <NotOptedIn />
    </Box>
  );
}
