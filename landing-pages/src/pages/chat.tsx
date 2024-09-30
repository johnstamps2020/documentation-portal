import { createFileRoute } from '@tanstack/react-router';
import { ChatProvider, ChatWrapper, translate } from '@doctools/core';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { useLayoutContext } from 'LayoutContext';
import AccessControl from 'components/AccessControl/AccessControl';
import { useUserInfo } from 'hooks/useApi';
import { useEffect } from 'react';

export const Route = createFileRoute('/chat')({
  component: ChatPage,
});

function ChatPage() {
  const { setTitle } = useLayoutContext();
  const {
    userInfo,
    isError: userInfoError,
    isLoading: userInfoLoading,
  } = useUserInfo();

  useEffect(() => {
    setTitle(translate({ id: 'chat.default-title', message: "Let's chat!" }));
  }, [setTitle]);

  if (userInfoLoading) {
    return <CircularProgress />;
  }

  if (userInfoError) {
    return (
      <Alert severity="error">
        <Box>Cannot load user information.</Box>
        <pre>
          <code>{JSON.stringify(userInfoError, null, 2)}</code>
        </pre>
      </Alert>
    );
  }

  if (!userInfo) {
    return <Alert severity="error">User info not available</Alert>;
  }

  return (
    <AccessControl allowedOnEnvs={['dev']} accessLevel="everyone">
      <Container>
        <ChatProvider userInfo={userInfo}>
          <ChatWrapper />
        </ChatProvider>
      </Container>
    </AccessControl>
  );
}
