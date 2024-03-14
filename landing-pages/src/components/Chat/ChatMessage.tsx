import { ChatbotMessage } from '@doctools/server';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { translate } from '@doctools/components';

export default function ChatMessage({ role, message }: ChatbotMessage) {
  if (role === 'user') {
    return (
      <Typography variant="h2" fontSize="30px" width="100%">
        {message}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3">
        {translate({
          id: 'chat.answer',
          message: 'Answer',
        })}
      </Typography>
      {message}
    </Box>
  );
}
