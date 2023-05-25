import SearchResult from './SearchResult';
import Typography from '@mui/material/Typography';
import AppliedFilters from './AppliedFilters';
import PaginationSelector from './PaginationSelector';
import Stack from '@mui/material/Stack';
import Highlighter from './Highlighter';
import useClearFilters from 'hooks/useClearFilters';
import ClearFilterButton from './ClearFiltersButton';
import { StyledHeading1 } from './StyledSearchComponents';
import { useSearchData } from 'hooks/useApi';
import Skeleton from '@mui/material/Skeleton';
import ResultsSkeleton from './ResultsSkeleton';

//TODO: Don't return null if no searchData, use Skeletons to load while waiting for searchData elements
export default function SearchResults() {
  const { searchData, isLoading, isError } = useSearchData();
  const { noFiltersApplied } = useClearFilters();

  if (isError) {
    return null;
  }

  if (searchData?.totalNumOfResults === 0) {
    return (
      <>
        <Stack spacing={1}>
          <StyledHeading1>
            Sorry, your search for "{searchData!.searchPhrase}" returned no
            results
          </StyledHeading1>
          <AppliedFilters />
        </Stack>
        {!noFiltersApplied && (
          <ClearFilterButton label="Clear filters and search again" />
        )}
      </>
    );
  }
  return (
    <>
      <Stack direction="row" justifyContent="flex-start" alignItems="center">
        {searchData && !isLoading ? (
          <StyledHeading1>
            Search results for "{searchData.searchPhrase}"
          </StyledHeading1>
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              width: { sm: '700px', xs: '100%' },
              height: '60px',
              marginRight: '20px',
            }}
          />
        )}
        <Highlighter />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ padding: '0.5rem 0 2rem 0.5rem' }}
      >
        <Stack spacing={1}>
          {searchData && !isLoading ? (
            <Typography paragraph sx={{ padding: 0, margin: 0 }}>
              {`${searchData.totalNumOfResults} ${
                searchData.totalNumOfResults === 1 ? 'result' : 'results'
              }`}
            </Typography>
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                width: { sm: '150px', xs: '100%' },
                height: '24px',
                marginTop: '0.3rem',
              }}
            />
          )}
          <AppliedFilters />
        </Stack>
        <PaginationSelector />
      </Stack>
      {searchData ? (
        <>
          {searchData.searchResults.map((r, index) => (
            <SearchResult key={`${r.title.toLowerCase()}${index}`} {...r} />
          ))}
        </>
      ) : (
        <ResultsSkeleton />
      )}
    </>
  );
}
