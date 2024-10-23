import Box from '@mui/material/Box';
import { useLocation } from '@tanstack/react-router';
import { HeaderContextProvider } from 'components/Layout/Header/HeaderContext';
import { useLayoutContext } from 'LayoutContext';
import React from 'react';
import Footer from './Footer';
import Header from './Header/Header';
import { headerHeight } from './Header/headerVars';
import { NotificationProvider } from './NotificationContext';

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
            {children}
        </Box>
      </main>
      <Footer path={path} />
    </NotificationProvider>
  );
}
