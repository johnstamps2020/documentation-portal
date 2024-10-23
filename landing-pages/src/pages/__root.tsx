import { GwThemeProvider, Init } from '@doctools/core';
import CssBaseline from '@mui/material/CssBaseline';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import ErrorPage from 'components/ErrorPage';
import FourOhFourPage from 'components/FourOhFourPage';
import { LanguageContextProvider } from 'components/LanguageContext/LanguageContext';
import Layout from 'components/Layout/Layout';
import { LayoutContextProvider } from 'LayoutContext';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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
  const location = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onError={() => console.error()}
      key={location.pathname}
    >
      <GwThemeProvider>
        <LanguageContextProvider>
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
        </LanguageContextProvider>
      </GwThemeProvider>
    </ErrorBoundary>
  );
}

export const Route = createRootRoute({
  component: () => <AppRoot />,
  notFoundComponent: () => <FourOhFourPage />,
});
