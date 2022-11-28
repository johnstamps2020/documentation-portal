import Layout from "../../components/Layout/Layout";
import Stack from "@mui/material/Stack";
import { searchPageTheme } from "../../themes/searchPageTheme";
import { Divider, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { SearchProvider } from "../../context/SearchContext";
import SearchFiltersPanel from "../../components/SearchResults/SearchFiltersPanel";
import SearchPageBackdrop from "../../components/SearchResults/SearchPageBackdrop";
import SearchResultsPanel from "../../components/SearchResults/SearchResultsPanel";

export default function SearchPage() {
  return (
    <SearchProvider>
      <Layout title="Search results" hideSearchBox>
        <ThemeProvider theme={searchPageTheme}>
          <CssBaseline enableColorScheme />
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
        </ThemeProvider>
      </Layout>
    </SearchProvider>
  );
}
