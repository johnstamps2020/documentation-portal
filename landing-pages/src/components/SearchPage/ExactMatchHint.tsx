import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useSearchData } from 'hooks/useApi';
import { Link as RouterLink } from 'react-router-dom';

export default function ExactMatchHint() {
  const { searchData, isLoading } = useSearchData();
  const queryParams = window.location.search;
  const query = new URLSearchParams(queryParams).get('q');

  if (isLoading || !searchData) {
    return (
      <Skeleton variant="rectangular" height="24px" width="330px"></Skeleton>
    );
  }

  if (searchData.searchPhrase && query && !/["]/.test(query)) {
    const exactQueryParams = queryParams.replace(query, `"${query}"`);
    return (
      <Typography>
        Looking for an exact match? Search for{' '}
        <Link
          component={RouterLink}
          to={`/search-results${exactQueryParams}`}
          relative="path"
        >
          "{searchData.searchPhrase}"
        </Link>
      </Typography>
    );
  }
  return <></>;
}
