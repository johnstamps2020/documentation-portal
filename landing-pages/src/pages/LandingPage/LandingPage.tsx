import { useNavigate } from 'react-router-dom';
import Layout from 'components/Layout/Layout';
import { lazy, Suspense, useEffect } from 'react';
import { Theme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import { usePageData } from 'hooks/usePageData';
import { LandingPageProps } from './LandingPageTypes';

type LazyPageComponent = React.LazyExoticComponent<
  React.ComponentType<LandingPageProps>
>;

export default function LandingPage() {
  const navigate = useNavigate();
  const { pageData, isError, isLoading } = usePageData();

  useEffect(() => {
    if (isError?.redirectUrl) {
      navigate(isError.redirectUrl);
    }
  }, [isError]);

  useEffect(() => {
    if (pageData?.component?.includes('redirect')) {
      navigate(`/${pageData.component.split(' ')[1]}`);
    }
  }, [pageData]);

  if (!pageData) {
    return <></>;
  }

  const PageComponent = lazy(() => {
    const pageDataPath = pageData.path;
    return pageDataPath === '/'
      ? import('pages/landing/Index')
      : import(`pages/landing/${pageDataPath}`);
  }) as LazyPageComponent;

  return (
    <Layout
      title={pageData.title}
      headerOptions={{ searchFilters: pageData.searchFilters }}
      path={pageData.path}
    >
      <>
        {isError && (
          <Alert severity="error" variant="filled">
            {isError.message}
          </Alert>
        )}
      </>
      <Suspense
        fallback={<Skeleton variant="rounded" width="100%" height="100vh" />}
      >
        <PageComponent title={pageData.title} />
      </Suspense>
      <Backdrop
        open={isLoading}
        sx={{
          color: '#fff',
          zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
        }}
      />
    </Layout>
  );
}
