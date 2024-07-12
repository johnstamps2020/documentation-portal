import NotLoggedInAlert from './NotLoggedInAlert';
import { SearchBox, Filters } from '@doctools/components';
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
import ExactMatchHint from './ExactMatchHint';
import SearchTypeSelector from './SearchTypeSelector';
import { useEnvInfo, useSearchData } from 'hooks/useApi';
import { useLocaleParams } from 'hooks/useLocale';
import { useMobile } from 'hooks/useMobile';
import { searchTypeQueryParameterName } from 'vars';

export default function SearchResultPanel() {
  const { envInfo } = useEnvInfo();
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
          {envInfo?.name === 'dev' && <SearchTypeSelector />}
          <SearchBox
            searchFilters={searchFilters}
            placeholder={placeholder}
            phrase={searchData?.searchPhrase || ''}
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
