import { useNavigate } from 'react-router-dom';
import { mainHeight } from 'components/Layout/Layout';
import { lazy, Suspense, useEffect } from 'react';
import { Theme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import { usePageData } from 'hooks/usePageData';
import { LandingPageProps } from './LandingPageTypes';
import { useLayoutContext } from 'LayoutContext';

type LazyPageComponent = React.LazyExoticComponent<
  React.ComponentType<LandingPageProps>
>;

export default function LandingPage() {
  const navigate = useNavigate();
  const { pageData, isError, isLoading } = usePageData();
  const { title, setTitle, setHeaderOptions, setPath } = useLayoutContext();

  useEffect(() => {
    const redirectError = isError?.redirect;
    if (redirectError) {
      const redirectUrl = redirectError.url;
      if (redirectError.type === 'internal') navigate(redirectUrl);
      if (redirectError.type === 'external')
        window.location.replace(redirectUrl);
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (pageData?.component?.includes('redirect')) {
      navigate(`/${pageData.component.split(' ')[1]}`);
    }
  }, [pageData, navigate]);

  useEffect(() => {
    if (pageData?.title) {
      setTitle(pageData.title);
    }
    if (pageData?.searchFilters) {
      setHeaderOptions({ searchFilters: pageData.searchFilters || undefined });
    }
    if (pageData?.path) {
      setPath(pageData.path);
    }
  }, [pageData, setHeaderOptions, setPath, setTitle]);

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
    <>
      <>
        {isError && (
          <Alert severity="error" variant="filled">
            {isError.message}
          </Alert>
        )}
      </>
      <Suspense
        fallback={
          <Skeleton variant="rounded" width="100%" height={mainHeight} />
        }
      >
        <PageComponent title={title} />
      </Suspense>
      <Backdrop
        open={isLoading}
        sx={{
          color: '#fff',
          zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
        }}
      />
    </>
  );
}
