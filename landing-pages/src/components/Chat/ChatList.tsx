import Stack from '@mui/material/Stack';
import { useChat } from './ChatContext';
import ChatInputBox from './ChatInputBox';
import ChatMessage from './ChatMessage';
import Box from '@mui/material/Box';

export default function ChatList() {
  const { messages } = useChat();

  return (
    <>
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
          position: 'sticky',
          bottom: 10,
          width: '100%',
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          padding: { xs: '0', md: '0.3rem' },
        }}
      >
        <ChatInputBox />
      </Box>
    </>
  );
}