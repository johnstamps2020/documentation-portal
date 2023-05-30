import NotLoggedInAlert from './NotLoggedInAlert';
import SearchBox from 'components/SearchBox/SearchBox';
import LoadingSearchDataErrorAlert from './LoadingSearchDataErrorAlert';
import SearchResultSection from './SearchResultSection';
import Stack from '@mui/material/Stack';
import PaginationControl from './PaginationControl';
import AdvancedSearchHelpButton from './AdvancedSearchHelpButton';
import AdvancedSearchHelpSection from './AdvancedSearchHelpSection';

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
        <AdvancedSearchHelpButton />
      </Stack>
      <Stack>
        <LoadingSearchDataErrorAlert />
        <SearchResultSection />
      </Stack>
      <PaginationControl />
      <AdvancedSearchHelpSection />
    </Stack>
  );
}
