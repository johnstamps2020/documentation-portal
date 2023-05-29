import ClearFilterButton from './ClearFiltersButton';
import { useSearchData } from 'hooks/useApi';
import useClearFilters from 'hooks/useClearFilters';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function SearchResultsZero() {
  const { searchData } = useSearchData();
  const { noFiltersApplied } = useClearFilters();

  if (!searchData || searchData.totalNumOfResults > 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography>
        Sorry, your search for "{searchData?.searchPhrase}" returned no results
      </Typography>
      {!noFiltersApplied && (
        <ClearFilterButton label="Clear filters and search again" />
      )}
    </Stack>
  );
}
