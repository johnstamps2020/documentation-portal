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
import PageAdminPage from 'components/AdminPage/PageAdminPage/PageAdminPage';
import AdminPage from 'pages/AdminPage/AdminPage';
import { LayoutContextProvider } from 'LayoutContext';
import Layout from 'components/Layout/Layout';
import ExternalLinkAdminPage from 'components/AdminPage/ExternalLinkAdminPage/ExternalLinkAdminPage';
import SourceAdminPage from 'components/AdminPage/SourceAdminPage/SourceAdminPage';
import ResourceAdminPage from 'components/AdminPage/ResourceAdminPage/ResourceAdminPage';
import ReleaseAdminPage from 'components/AdminPage/ReleaseAdminPage/ReleaseAdminPage';
import SubjectAdminPage from 'components/AdminPage/SubjectAdminPage/SubjectAdminPage';
import LanguageAdminPage from 'components/AdminPage/LanguageAdminPage/LanguageAdminPage';
import PlatformAdminPage from 'components/AdminPage/PlatformAdminPage/PlatformAdminPage';
import ProductAdminPage from 'components/AdminPage/ProductAdminPage/ProductAdminPage';
import VersionAdminPage from 'components/AdminPage/VersionAdminPage/VersionAdminPage';
import DeltaDocCompareToolPage from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';

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
        children: [
          {
            path: 'page',
            element: <PageAdminPage />,
          },
          {
            path: 'external-link',
            element: <ExternalLinkAdminPage />,
          },
          {
            path: 'source',
            element: <SourceAdminPage />,
          },
          {
            path: 'resource',
            element: <ResourceAdminPage />,
          },
          {
            path: 'release',
            element: <ReleaseAdminPage />,
          },
          {
            path: 'subject',
            element: <SubjectAdminPage />,
          },
          {
            path: 'language',
            element: <LanguageAdminPage />,
          },
          {
            path: 'platform',
            element: <PlatformAdminPage />,
          },
          {
            path: 'product',
            element: <ProductAdminPage />,
          },
          {
            path: 'version',
            element: <VersionAdminPage />,
          },
        ],
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
      { path: 'delta-doc', element: <DeltaDocCompareToolPage />},
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
