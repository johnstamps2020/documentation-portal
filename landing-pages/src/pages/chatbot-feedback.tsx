import { createFileRoute } from '@tanstack/react-router';
import { ChatFeedbackPage } from '@doctools/components';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { useLayoutContext } from 'LayoutContext';
import AccessControl from 'components/AccessControl/AccessControl';
import { useUserInfo } from 'hooks/useApi';
import { useEffect } from 'react';

export const Route = createFileRoute('/chatbot-feedback')({
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
    setTitle('Feedback about the chatbot!');
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
        <ChatFeedbackPage />
      </Container>
    </AccessControl>
  );
}
