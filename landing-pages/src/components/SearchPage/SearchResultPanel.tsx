import NotLoggedInAlert from './NotLoggedInAlert';
import SearchBox from 'components/SearchBox/SearchBox';
import LoadingSearchDataErrorAlert from './LoadingSearchDataErrorAlert';
import SearchResultSection from './SearchResultSection';
import Stack from '@mui/material/Stack';
import PaginationControl from './PaginationControl';
import AdvancedSearchHelpButton from './AdvancedSearchHelpButton';
import AdvancedSearchHelpSection from './AdvancedSearchHelpSection';
import Container from '@mui/material/Container';
import { mainHeight } from 'components/Layout/Layout';
import { useSearchLayoutContext } from './SearchLayoutContext';
import { useTheme } from '@mui/material/styles';

export default function SearchResultPanel() {
  const { helpWidth, isHelpExpanded } = useSearchLayoutContext();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        padding: { xs: '12px', sm: '32px' },
        height: mainHeight,
        width: '100%',
        overflow: 'scroll',
        scrollbarWidth: 'thin',
      }}
    >
      <Container
        sx={{
          width: { sm: isHelpExpanded ? `calc(100% - ${helpWidth})` : '100%' },
          marginRight: { sm: isHelpExpanded ? helpWidth : 'auto' },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
            ...(isHelpExpanded && {
              transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              marginRight: 0,
            }),
          }),
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
      </Container>
      <AdvancedSearchHelpSection />
    </Stack>
  );
}
