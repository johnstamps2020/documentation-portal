import ClearFilterButton from './ClearFiltersButton';
import { useSearchData } from 'hooks/useApi';
import useClearFilters from 'hooks/useClearFilters';
import Stack from '@mui/material/Stack';

export default function SearchResultsZero() {
  const { searchData } = useSearchData();
  const { noFiltersApplied } = useClearFilters();

  if (!searchData || searchData.totalNumOfResults > 0 || noFiltersApplied) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={{ xs: 0, sm: 2 }}
      gap={2}
      alignItems="center"
      flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
    >
      {!noFiltersApplied && (
        <ClearFilterButton label="Clear filters and search again" />
      )}
    </Stack>
  );
}
