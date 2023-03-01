import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { lazy, Suspense } from 'react';
import { Theme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import { usePageData } from '../../hooks/usePageData';

export const baseBackgroundProps = {
  backgroundAttachment: 'fixed',
  backgroundPosition: 'bottom-right',
  backgroundSize: 'cover',
  minHeight: '100vh',
};

export type LandingPageProps = {
  title: string;
};

export type LandingPageLayoutProps = {
  backgroundProps: {
    backgroundImage?: any;
    backgroundAttachment: string;
    backgroundPosition: string;
    backgroundSize: string;
    minHeight: string;
  };
  sidebar?: SidebarProps;
};

export type LandingPageItemProps = {
  label?: string;
  docId?: string;
  pagePath?: string;
  url?: string;
};

export type SidebarProps = {
  label: string;
  items: LandingPageItemProps[];
};

type LazyPageComponent = React.LazyExoticComponent<
  React.ComponentType<LandingPageProps>
>;

export default function LandingPage() {
  const navigate = useNavigate();
  const { pageData, isError, isLoading } = usePageData();

  if (isError?.redirectUrl) {
    navigate(isError.redirectUrl);
  }

  if (pageData?.component?.includes('redirect')) {
    navigate(`/${pageData.component.split(' ')[1]}`);
  }

  if (!pageData) {
    return <></>;
  }

  const PageComponent = lazy(() =>
    import(`../landing/${pageData.path}`)
  ) as LazyPageComponent;

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
