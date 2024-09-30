import { Filters, SearchBox, useEnvStore } from '@doctools/core';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { mainHeight } from 'components/Layout/Layout';
import { useSearchData } from 'hooks/useApi';
import { useLocaleParams } from 'hooks/useLocale';
import { useMobile } from 'hooks/useMobile';
import { searchTypeQueryParameterName } from 'vars';
import AdvancedSearchHelpButton from './AdvancedSearchHelpButton';
import AdvancedSearchHelpSection from './AdvancedSearchHelpSection';
import ExactMatchHint from './ExactMatchHint';
import LoadingSearchDataErrorAlert from './LoadingSearchDataErrorAlert';
import NotLoggedInAlert from './NotLoggedInAlert';
import PaginationControl from './PaginationControl';
import { useSearchLayoutContext } from './SearchLayoutContext';
import SearchResultSection from './SearchResultSection';
import SearchTypeSelector from './SearchTypeSelector';

export default function SearchResultPanel() {
  const envName = useEnvStore((state) => state.envName);
  const { helpWidth, isHelpExpanded } = useSearchLayoutContext();
  const theme = useTheme();
  const { searchData } = useSearchData();
  const { placeholder } = useLocaleParams();
  const { isMobile } = useMobile();

  const searchFilters: Filters = {};

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
          }),
        }}
      >
        <Stack alignItems="center" sx={{ marginBottom: 3 }} spacing={2}>
          <NotLoggedInAlert />
          {envName === 'dev' && <SearchTypeSelector />}
          <SearchBox
            searchFilters={searchFilters}
            placeholder={placeholder}
            isMobile={isMobile}
            searchTypeQueryParameterName={searchTypeQueryParameterName}
          />
          <ExactMatchHint />
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
