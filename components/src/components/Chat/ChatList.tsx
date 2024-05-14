import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import { useChat } from './ChatContext';
import { ChatInputBox } from './ChatInputBox';
import { ChatMessage } from './ChatMessage';

export function ChatList() {
  const { messages } = useChat();
  const shadowColor = 'rgba(255, 255, 255, 0.97)';

  return (
    <Stack
      sx={{
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        sx={{
          gap: 4,
          paddingTop: '2rem',
        }}
      >
        <Stack sx={{ gap: 2, overflow: 'auto', width: '100%' }}>
          {messages.map((item, index) => (
            <ChatMessage
              key={index}
              isLast={index === messages.length - 1}
              {...item}
            />
          ))}
        </Stack>
      </Stack>
      <Box
        sx={{
          width: '100%',
          backgroundColor: shadowColor,
        }}
      >
        <ChatInputBox />
      </Box>
    </Stack>
  );
}
