import { ChatWrapper } from '@doctools/components';
import { ChatProvider } from '@doctools/components';
import { translate } from '@doctools/components';
import Container from '@mui/material/Container';
import { useLayoutContext } from 'LayoutContext';
import AdminAccess from 'components/AccessControl/AccessControl';
import { useEffect } from 'react';

export default function ChatPage() {
  const { setTitle } = useLayoutContext();

  useEffect(() => {
    setTitle(translate({ id: 'chat.default-title', message: "Let's chat!" }));
  }, [setTitle]);

  return (
    <AdminAccess
      pagePath={window.location.href}
      checkAdminAccess={true}
      checkPowerUserAccess={false}
    >
      <Container>
        <ChatProvider>
          <ChatWrapper />
        </ChatProvider>
      </Container>
    </AdminAccess>
  );
}
