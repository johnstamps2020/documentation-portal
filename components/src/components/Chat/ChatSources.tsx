import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Translate } from '../../lib';
import { ChatbotMessage } from '../../types/chatbot';

type ChatSourcesProps = {
  sources: ChatbotMessage['sources'];
};

export default function ChatSources({ sources }: ChatSourcesProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Typography variant="h3">
        <Translate id="chat.sources">Sources</Translate>
      </Typography>
      {sources?.map(({ title, url }, key) => (
        <Link key={key} href={url} target="_blank" underline="always">
          {title}
        </Link>
      ))}
    </Box>
  );
}
