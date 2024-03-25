import Header, { headerHeight } from './Header/Header';
import Footer from './Footer';
import Box from '@mui/material/Box';
import { useLayoutContext } from 'LayoutContext';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from 'pages/ErrorPage/ErrorPage';
import { useLocation } from 'react-router-dom';
import { NotificationProvider } from './NotificationContext';
import { HeaderContextProvider } from './Header/HeaderContext';

export const mainHeight = `calc(100vh - ${headerHeight})`;

export default function Layout() {
  const location = useLocation();
  const { title, backgroundColor, path } = useLayoutContext();
  document.title = `${title} | Guidewire Documentation`;

  return (
    <NotificationProvider>
      <Header />
      <main style={{ backgroundColor }}>
        <Box
          sx={{
            minHeight: { xs: 'auto', sm: mainHeight },
          }}
        >
          <ErrorBoundary
            FallbackComponent={ErrorPage}
            onError={() => console.error()}
            key={location.pathname}
          >
            <Outlet />
          </ErrorBoundary>
        </Box>
      </main>
      <Footer path={path} />
    </NotificationProvider>
  );
}
