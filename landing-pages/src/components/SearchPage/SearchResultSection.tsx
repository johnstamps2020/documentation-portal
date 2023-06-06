import AppliedFilters from './AppliedFilters';
import PaginationSelector from './PaginationSelector';
import Stack from '@mui/material/Stack';
import Highlighter from './Highlighter';
import { useSearchData } from 'hooks/useApi';
import SearchResultsZero from './SearchResultsZero';
import SearchResultSectionHeading from './SearchResultSectionHeading';
import SearchResultList from './SearchResultList';

export default function SearchResultSection() {
  const { isError } = useSearchData();

  if (isError) {
    return null;
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
      >
        <SearchResultSectionHeading />
        <Highlighter />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ padding: '0.5rem 0 2rem 0.5rem' }}
        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
        gap={2}
      >
        <Stack spacing={1}>
          <AppliedFilters />
          <SearchResultsZero />
        </Stack>
        <PaginationSelector />
      </Stack>
      <SearchResultList />
    </>
  );
}
