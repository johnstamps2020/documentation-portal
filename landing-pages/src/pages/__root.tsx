import { GwThemeProvider, Init } from '@doctools/components';
import CssBaseline from '@mui/material/CssBaseline';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import FourOhFourPage from 'components/FourOhFourPage';
import Layout from 'components/Layout/Layout';
import { LayoutContextProvider } from 'LayoutContext';

function AppRoot() {
  return (
    <GwThemeProvider>
      <Init />
      <LayoutContextProvider>
        <CssBaseline />
        <Layout>
          <Outlet />
        </Layout>
        <TanStackRouterDevtools />
      </LayoutContextProvider>
    </GwThemeProvider>
  );
}

export const Route = createRootRoute({
  component: () => <AppRoot />,
  notFoundComponent: () => <FourOhFourPage />,
});
