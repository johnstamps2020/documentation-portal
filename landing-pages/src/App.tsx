import { GwThemeProvider } from '@doctools/components';
import CssBaseline from '@mui/material/CssBaseline';
import ExternalLinkAdminPage from 'components/AdminPage/ExternalLinkAdminPage/ExternalLinkAdminPage';
import LanguageAdminPage from 'components/AdminPage/LanguageAdminPage/LanguageAdminPage';
import PageAdminPage from 'components/AdminPage/PageAdminPage/PageAdminPage';
import PlatformAdminPage from 'components/AdminPage/PlatformAdminPage/PlatformAdminPage';
import ProductAdminPage from 'components/AdminPage/ProductAdminPage/ProductAdminPage';
import ReleaseAdminPage from 'components/AdminPage/ReleaseAdminPage/ReleaseAdminPage';
import ResourceAdminPage from 'components/AdminPage/ResourceAdminPage/ResourceAdminPage';
import SourceAdminPage from 'components/AdminPage/SourceAdminPage/SourceAdminPage';
import SubjectAdminPage from 'components/AdminPage/SubjectAdminPage/SubjectAdminPage';
import VersionAdminPage from 'components/AdminPage/VersionAdminPage/VersionAdminPage';
import Layout from 'components/Layout/Layout';
import { LayoutContextProvider } from 'LayoutContext';
import AdminPage from 'pages/AdminPage/AdminPage';
import ChatPage from 'pages/ChatPage';
import DeltaDocCompareToolPage from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import ForbiddenPage from 'pages/ForbiddenPage/ForbiddenPage';
import FourOhFourPage from 'pages/FourOhFourPage/FourOhFourPage';
import InternalPage from 'pages/InternalPage/InternalPage';
import LandingPage from 'pages/LandingPage/LandingPage';
import LoginPage from 'pages/LoginPage/LoginPage';
import SearchPage from 'pages/SearchPage/SearchPage';
import SupportPage from 'pages/SupportPage/SupportPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HeaderContextProvider } from 'components/Layout/Header/HeaderContext';

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
      { path: 'delta-doc', element: <DeltaDocCompareToolPage /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
]);

function App() {
  return (
    <GwThemeProvider>
      <LayoutContextProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </LayoutContextProvider>
    </GwThemeProvider>
  );
}

export default App;
