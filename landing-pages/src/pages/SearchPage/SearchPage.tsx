import Layout from '../../components/Layout/Layout';
import Stack from '@mui/material/Stack';
import { Divider, Drawer } from '@mui/material';
import SearchFilterPanel from '../../components/SearchPage/SearchFilterPanel';
import SearchPageBackdrop from '../../components/SearchPage/SearchPageBackdrop';
import SearchResultPanel from '../../components/SearchPage/SearchResultPanel';
import { useState } from 'react';
import FilterButton from '../../components/SearchPage/FilterButton';
import { useMobile } from '../../hooks/useMobile';

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { isMobile } = useMobile();
  return (
    <Layout title="Search results" headerOptions={{ hideSearchBox: true }}>
      <Stack>
        {isMobile && <FilterButton setShowFilters={setShowFilters} />}
      </Stack>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="flex-start"
        width="100%"
        minHeight="100vh"
      >
        {isMobile ? (
          <Drawer
            open={showFilters}
            variant="temporary"
            onClose={() => setShowFilters(false)}
          >
            <SearchFilterPanel />
          </Drawer>
        ) : (
          <SearchFilterPanel />
        )}
        <SearchResultPanel />
      </Stack>
      <SearchPageBackdrop />
    </Layout>
  );
}
