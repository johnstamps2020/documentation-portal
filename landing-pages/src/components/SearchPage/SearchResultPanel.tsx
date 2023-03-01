import NotLoggedInAlert from './NotLoggedInAlert';
import SearchBox from '../SearchBox/SearchBox';
import AdvancedSearchHelp from './AdvancedSearchHelp';
import LoadingSearchDataErrorAlert from './LoadingSearchDataErrorAlert';
import SearchResults from './SearchResults';
import Stack from '@mui/material/Stack';
import PaginationControl from './PaginationControl';

export default function SearchResultPanel() {
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
        <SearchBox />
        <AdvancedSearchHelp />
      </Stack>
      <Stack>
        <LoadingSearchDataErrorAlert />
        <SearchResults />
      </Stack>
      <PaginationControl />
    </Stack>
  );
}
