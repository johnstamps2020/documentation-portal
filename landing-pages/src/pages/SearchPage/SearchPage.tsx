import { mainHeight } from 'components/Layout/Layout';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SearchPageBackdrop from 'components/SearchPage/SearchPageBackdrop';
import SearchResultPanel from 'components/SearchPage/SearchResultPanel';
import FilterButton from 'components/SearchPage/FilterButton';
import { SearchLayoutContextProvider } from 'components/SearchPage/SearchLayoutContext';
import SearchFilterLayout from 'components/SearchPage/SearchFilters/SearchFilterLayout';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

export default function SearchPage() {
  const { setTitle, setHeaderOptions } = useLayoutContext();

  useEffect(() => {
    setTitle('Search results');
    setHeaderOptions({ hideSearchBox: true });
  }, [setHeaderOptions, setTitle]);

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
