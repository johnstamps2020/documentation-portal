import { translate } from '@doctools/components';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessageProps } from './ChatContext';
import ChatLoader from './ChatLoader';
import './ChatMessage.css';

type ChatMessageDisplayProps = ChatMessageProps & {
  isLast: boolean;
};

function UserMessage({ message, isLast }: ChatMessageDisplayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setTitle } = useLayoutContext();

  useEffect(() => {
    if (isLast && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLast]);

  useEffect(() => {
    setTitle(message);
  }, [setTitle, message]);

  return (
    <Stack direction="row" sx={{ gap: 2 }}>
      {isLast && <ChatLoader />}
      <Typography variant="h2" fontSize="30px" width="100%" ref={wrapperRef}>
        {message}
      </Typography>
    </Stack>
  );
}

export default function ChatMessage({
  role,
  message,
  isLast,
}: ChatMessageDisplayProps) {
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (role === 'user') {
    return <UserMessage message={message} isLast={isLast} />;
  }

  return (
    <Box sx={{ width: '100%' }} ref={responseRef}>
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
