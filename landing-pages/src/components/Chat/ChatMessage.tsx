import { ChatbotMessage } from '@doctools/server';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { translate } from '@doctools/components';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatMessage.css';

export default function ChatMessage({ role, message }: ChatbotMessage) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (role === 'user') {
    return (
      <Typography variant="h2" fontSize="30px" width="100%">
        {message}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%' }} ref={wrapperRef}>
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
