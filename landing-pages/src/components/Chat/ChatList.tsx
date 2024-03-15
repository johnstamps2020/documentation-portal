import Stack from '@mui/material/Stack';
import { useChat } from './ChatContext';
import ChatInputBox from './ChatInputBox';
import ChatMessage from './ChatMessage';
import Box from '@mui/material/Box';

export default function ChatList() {
  const { messages } = useChat();
  const boxWidth = '90vw';
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
            <ChatMessage key={index} {...item} />
          ))}
        </Stack>
      </Stack>
      <Box
        sx={{
          position: 'sticky',
          bottom: 10,
          width: boxWidth,
          left: `calc(100vw - ${boxWidth})`,
          backgroundColor: 'white',
          padding: { xs: '0', md: '1rem' },
        }}
      >
        <ChatInputBox />
      </Box>
    </>
  );
}
