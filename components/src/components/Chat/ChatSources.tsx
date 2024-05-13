import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ChatbotMessage } from './types';
import Link from '@mui/material/Link';
import { Translate } from '../../lib';
import Box from '@mui/material/Box';

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
