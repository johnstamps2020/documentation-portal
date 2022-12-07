import Layout from "../../components/Layout/Layout";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";
import { SearchProvider } from "../../context/SearchContext";
import SearchFiltersPanel from "../../components/Search/SearchFiltersPanel";
import SearchPageBackdrop from "../../components/Search/SearchPageBackdrop";
import SearchResultsPanel from "../../components/Search/SearchResultsPanel";

export default function SearchPage() {
  return (
    <SearchProvider>
      <Layout title="Search results" searchBoxOptions={{ hideSearchBox: true }}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="flex-start"
          width="100%"
        >
          <SearchFiltersPanel />
          <SearchResultsPanel />
        </Stack>
        <SearchPageBackdrop />
      </Layout>
    </SearchProvider>
  );
}
