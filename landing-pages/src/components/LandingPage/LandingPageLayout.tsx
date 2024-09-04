import Alert from '@mui/material/Alert';
import { usePageData } from 'hooks/usePageData';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

type LandingPageLayoutProps = {
  children: React.ReactNode;
};

export default function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  const { pageData, isError } = usePageData();
  const { setTitle, setPath } = useLayoutContext();

  // TODO create useStorage hook(s)
  sessionStorage.setItem('latestLandingPagePath', pageData?.path || '');

  if (pageData?.searchFilters?.release) {
    sessionStorage.setItem(
      'latestLandingPageReleases',
      pageData.searchFilters.release.toString()
    );
  } else {
    sessionStorage.removeItem('latestLandingPageReleases');
  }

  useEffect(() => {
    const redirectError = isError?.redirect;
    if (redirectError) {
      const redirectUrl = redirectError.url;
      window.location.replace(redirectUrl);
    }
  }, [isError]);

  useEffect(() => {
    if (pageData?.title) {
      setTitle(pageData.title);
    }
    if (pageData?.path) {
      setPath(pageData.path);
    }
  }, [pageData, setPath, setTitle]);

  if (!pageData) {
    return <></>;
  }

  return (
    <>
      {isError && (
        <Alert severity="error" variant="filled">
          {isError.message}
        </Alert>
      )}
      {children}
    </>
  );
}
