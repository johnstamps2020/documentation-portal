import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import LandingPage from 'pages/LandingPage/LandingPage';
import ForbiddenPage from 'pages/ForbiddenPage/ForbiddenPage';
import FourOhFourPage from 'pages/FourOhFourPage/FourOhFourPage';
import SearchPage from 'pages/SearchPage/SearchPage';
import LoginPage from 'pages/LoginPage/LoginPage';
import { appTheme } from 'themes/appTheme';
import CssBaseline from '@mui/material/CssBaseline';
import SupportPage from 'pages/SupportPage/SupportPage';
import InternalPage from 'pages/InternalPage/InternalPage';
import PageAdminPage from 'pages/PageAdminPage/PageAdminPage';
import AdminPage from 'pages/AdminPage/AdminPage';
import { LayoutContextProvider } from 'LayoutContext';
import Layout from 'components/Layout/Layout';
import ExternalLinkAdminPage from 'pages/ExternalLinkAdminPage/ExternalLinkAdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'internal',
        element: <InternalPage />,
      },
      {
        path: 'forbidden',
        element: <ForbiddenPage />,
      },
      {
        path: '404',
        element: <FourOhFourPage />,
      },
      {
        path: 'admin-panel',
        element: <AdminPage />,
      },
      {
        path: 'admin-panel/page',
        element: <PageAdminPage />,
      },
      {
        path: 'admin-panel/external-link',
        element: <ExternalLinkAdminPage />,
      },
      {
        path: 'search-results',
        element: <SearchPage />,
      },
      {
        path: 'gw-login',
        element: <LoginPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
      },
      {
        path: '',
        element: <LandingPage />,
        children: [
          {
            path: '*',
            element: <LandingPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <LayoutContextProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </LayoutContextProvider>
    </ThemeProvider>
  );
}

export default App;
