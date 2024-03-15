import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChatInputBox from './ChatInputBox';
import { Translate } from '@doctools/components';
import { mainHeight } from 'components/Layout/Layout';

export default function EmptyChat() {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        minHeight: mainHeight,
      }}
    >
      <Typography variant="h1" textAlign="center">
        <Translate id="chat.introMessage">
          Ask a question about Guidewire docs
        </Translate>
      </Typography>
      <ChatInputBox />
    </Stack>
  );
}
