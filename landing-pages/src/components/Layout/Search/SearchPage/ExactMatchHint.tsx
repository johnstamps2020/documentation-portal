import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation } from '@tanstack/react-router';
import { useSearchData } from 'hooks/useApi';

export default function ExactMatchHint() {
  const { searchData, isLoading } = useSearchData();
  const location = useLocation();
  const query = new URLSearchParams(window.location.search);

  if (isLoading || !searchData) {
    return (
      <Skeleton variant="rectangular" height="24px" width="420px"></Skeleton>
    );
  }

  if (
    searchData.searchPhrase &&
    query &&
    query.has('q') &&
    !/["]/.test(query.get('q') as string)
  ) {
    query.set('q', `"${query.get('q')}"`);
    const exactQueryParams = `?${query.toString()}`;
    return (
      <Typography>
        Looking for an exact match?{' '}
        <Link
          component={RouterLink}
          from={location.pathname}
          to={`/search-results${exactQueryParams}`}
        >
          Click here to search for "{searchData.searchPhrase}"
        </Link>
      </Typography>
    );
  }

  return <div style={{ height: '24px' }}></div>;
}
