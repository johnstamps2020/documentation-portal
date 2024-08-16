import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import { useChat } from './ChatContext';
import { ChatInputBox } from './ChatInputBox';
import { ChatMessage } from './ChatMessage';
import { ChatReset } from './ChatReset';

export function ChatList() {
  const { items } = useChat();

  return (
    <>
      <Stack
        sx={{
          gap: 4,
          paddingTop: '2rem',
        }}
      >
        <Stack sx={{ gap: 2, width: '100%' }}>
          {items.map((item, index) => (
            <ChatMessage
              key={index}
              isLast={index === items.length - 1}
              {...item}
            />
          ))}
        </Stack>
      </Stack>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <ChatInputBox />
      </Box>
      <Box
        sx={{
          pb: 4,
          marginLeft: 'auto',
          width: 'fit-content',
        }}
      >
        <ChatReset />
      </Box>
    </>
  );
}
