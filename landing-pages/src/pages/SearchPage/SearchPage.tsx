import { mainHeight } from 'components/Layout/Layout';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SearchPageBackdrop from 'components/Layout/Search/SearchPage/SearchPageBackdrop';
import SearchResultPanel from 'components/Layout/Search/SearchPage/SearchResultPanel';
import FilterButton from 'components/Layout/Search/SearchPage/FilterButton';
import { SearchLayoutContextProvider } from 'components/Layout/Search/SearchPage/SearchLayoutContext';
import SearchFilterLayout from 'components/Layout/Search/SearchPage/SearchFilters/SearchFilterLayout';
import { useLayoutContext } from 'LayoutContext';
import { useSearchData } from 'hooks/useApi';
import { useEffect } from 'react';

export default function SearchPage() {
  const { setTitle } = useLayoutContext();
  const { searchData } = useSearchData();

  useEffect(() => {
    if (searchData?.searchPhrase) {
      setTitle(
        `${searchData.searchPhrase} | ${
          searchData.totalNumOfResults > 0
            ? `${searchData.totalNumOfResults} `
            : ``
        }search results`
      );
    } else {
      setTitle('Search results');
    }
  }, [searchData, searchData?.searchPhrase, setTitle]);

  return (
    <SearchLayoutContextProvider>
      <FilterButton />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="flex-start"
        width="100%"
        minHeight={mainHeight}
      >
        <SearchFilterLayout />
        <SearchResultPanel />
      </Stack>
      <SearchPageBackdrop />
    </SearchLayoutContextProvider>
  );
}
