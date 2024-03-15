import { ChatbotMessage } from '@doctools/server';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { translate } from '@doctools/components';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatMessage.css';
import { useLayoutContext } from 'LayoutContext';

function UserMessage({ message }: ChatbotMessage) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setTitle } = useLayoutContext();

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    setTitle(message);
  }, [setTitle, message]);

  return (
    <Typography variant="h2" fontSize="30px" width="100%" ref={wrapperRef}>
      {message}
    </Typography>
  );
}

export default function ChatMessage({ role, message }: ChatbotMessage) {
  if (role === 'user') {
    return <UserMessage message={message} />;
  }

  return (
    <Box sx={{ width: '100%' }}>
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
