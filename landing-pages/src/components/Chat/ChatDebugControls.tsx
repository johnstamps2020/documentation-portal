import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ForumIcon from '@mui/icons-material/Forum';
import { useChat } from './ChatContext';

export default function ChatDebugControls() {
  const { loadDebugMessages } = useChat();

  return (
    <Stack
      direction="row"
      sx={{
        width: '100%',
      }}
    >
      <Button
        variant="contained"
        onClick={loadDebugMessages}
        color="success"
        startIcon={<ForumIcon />}
      >
        Load debug messages
      </Button>
    </Stack>
  );
}
