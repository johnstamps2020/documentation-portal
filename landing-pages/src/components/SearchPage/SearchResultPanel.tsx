import NotLoggedInAlert from './NotLoggedInAlert';
import SearchBox from '../SearchBox/SearchBox';
import AdvancedSearchHelp from './AdvancedSearchHelp';
import LoadingSearchDataErrorAlert from './LoadingSearchDataErrorAlert';
import SearchResults from './SearchResults';
import Stack from '@mui/material/Stack';
import { useSearch } from '../../context/SearchContext';
import PaginationControl from './PaginationControl';

type SearchResultsPanelProps = {
  isMobile: boolean;
};
export default function SearchResultsPanel({
  isMobile,
}: SearchResultsPanelProps) {
  const { searchData } = useSearch();
  const searchFilters: { [key: string]: string[] } = {};
  if (searchData) {
    searchData.filters.forEach((f) => {
      const checkedValues = f.values.filter((v) => v.checked);

      if (checkedValues.length > 0) {
        searchFilters[f.name] = checkedValues
          .filter(Boolean)
          .map((v) => v.label);
      }
    });
  }

  if (!searchData) {
    return null;
  }

  return (
    <Stack
      sx={{
        padding: { xs: '12px', sm: '32px' },
        height: '100vh',
        width: '100%',
        overflow: 'scroll',
        scrollbarWidth: 'thin',
      }}
    >
      <Stack alignItems="center" sx={{ marginBottom: 3 }} spacing={2}>
        <NotLoggedInAlert />
        <SearchBox bigSize={!isMobile} searchFilters={searchFilters} />
        <AdvancedSearchHelp />
      </Stack>
      <Stack>
        <LoadingSearchDataErrorAlert />
        <SearchResults />
      </Stack>
      {searchData.pages > 1 && <PaginationControl />}
    </Stack>
  );
}
