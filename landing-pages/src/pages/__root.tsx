import { GwThemeProvider, Init } from '@doctools/core';
import CssBaseline from '@mui/material/CssBaseline';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import FourOhFourPage from 'components/FourOhFourPage';
import Layout from 'components/Layout/Layout';
import { LayoutContextProvider } from 'LayoutContext';
import { lazy, Suspense } from 'react';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

function AppRoot() {
  return (
    <GwThemeProvider>
      <Init />
      <LayoutContextProvider>
        <CssBaseline />
        <Layout>
          <Outlet />
        </Layout>
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
      </LayoutContextProvider>
    </GwThemeProvider>
  );
}

export const Route = createRootRoute({
  component: () => <AppRoot />,
  notFoundComponent: () => <FourOhFourPage />,
});
