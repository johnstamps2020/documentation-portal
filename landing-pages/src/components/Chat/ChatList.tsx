import Stack from '@mui/material/Stack';
import { useChat } from './ChatContext';
import ChatInputBox from './ChatInputBox';
import ChatMessage from './ChatMessage';

export default function ChatList() {
  const { messages } = useChat();
  return (
    <Stack
      sx={{
        gap: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '2rem',
      }}
    >
      <Stack sx={{ gap: 2, height: '80vh', overflow: 'auto', width: '100%' }}>
        {messages.map((item, index) => (
          <ChatMessage key={index} {...item} />
        ))}
      </Stack>
      <ChatInputBox />
    </Stack>
  );
}
