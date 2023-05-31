import Layout from 'components/Layout/Layout';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SearchPageBackdrop from 'components/SearchPage/SearchPageBackdrop';
import SearchResultPanel from 'components/SearchPage/SearchResultPanel';
import FilterButton from 'components/SearchPage/FilterButton';
import { SearchLayoutContextProvider } from 'components/SearchPage/SearchLayoutContext';
import SearchFilterLayout from 'components/SearchPage/SearchFilterLayout';

export default function SearchPage() {
  return (
    <Layout title="Search results" headerOptions={{ hideSearchBox: true }}>
      <SearchLayoutContextProvider>
        <FilterButton />
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="flex-start"
          width="100%"
          minHeight="100vh"
        >
          <SearchFilterLayout />
          <SearchResultPanel />
        </Stack>
        <SearchPageBackdrop />
      </SearchLayoutContextProvider>
    </Layout>
  );
}
