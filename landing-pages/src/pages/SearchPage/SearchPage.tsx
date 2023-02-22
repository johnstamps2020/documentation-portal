import Layout from "../../components/Layout/Layout";
import Stack from "@mui/material/Stack";
import { Divider, Drawer } from "@mui/material";
import { SearchProvider } from "../../context/SearchContext";
import SearchFiltersPanel from "../../components/SearchPage/SearchFiltersPanel";
import SearchPageBackdrop from "../../components/SearchPage/SearchPageBackdrop";
import SearchResultsPanel from "../../components/SearchPage/SearchResultsPanel";
import { useState } from "react";
import { appTheme } from "../../themes/appTheme";
import FiltersButton from "../../components/SearchPage/FiltersButton";

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);

  function checkIfMobile() {
    if (window.innerWidth <= appTheme.breakpoints.values.md) {
      return true;
    } else {
      return false;
    }
  }
  const isMobile = checkIfMobile();
  return (
    <SearchProvider>
      <Layout title="Search results" headerOptions={{ hideSearchBox: true }}>
        <Stack>
          {isMobile && <FiltersButton setShowFilters={setShowFilters} />}
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
              <SearchFiltersPanel />
            </Drawer>
          ) : (
            <SearchFiltersPanel />
          )}
          <SearchResultsPanel isMobile={isMobile} />
        </Stack>
        <SearchPageBackdrop />
      </Layout>
    </SearchProvider>
  );
}
