import Box from '@mui/material/Box';
import { useLocation } from '@tanstack/react-router';
import { HeaderContextProvider } from 'components/Layout/Header/HeaderContext';
import { useLayoutContext } from 'LayoutContext';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Footer from './Footer';
import Header, { headerHeight } from './Header/Header';
import { NotificationProvider } from './NotificationContext';
import ErrorPage from 'components/ErrorPage';

export const mainHeight = `calc(100vh - ${headerHeight})`;

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { title, backgroundColor, path } = useLayoutContext();
  document.title = `${title} | Guidewire Documentation`;

  return (
    <NotificationProvider>
      <HeaderContextProvider>
        <Header />
      </HeaderContextProvider>
      <main style={{ backgroundColor }}>
        <Box
          sx={{
            minHeight: { xs: 'auto', sm: mainHeight },
          }}
          key={location.pathname}
        >
          <ErrorBoundary
            FallbackComponent={ErrorPage}
            onError={() => console.error()}
            key={location.pathname}
          >
            {children}
          </ErrorBoundary>
        </Box>
      </main>
      <Footer path={path} />
    </NotificationProvider>
  );
}
