import SearchResult from "./SearchResult";
import { useSearch } from "../../context/SearchContext";
import Typography from "@mui/material/Typography";
import AppliedFilters from "./AppliedFilters";
import PaginationSelector from "./PaginationSelector";
import Stack from "@mui/material/Stack";
import Highlighter from "./Highlighter";
import Box from "@mui/material/Box";
import useClearFilters from "../../hooks/useClearFilters";
import ClearFilterButton from "./ClearFiltersButton";

export default function SearchResults() {
  const { searchData } = useSearch();
  const { noFiltersApplied } = useClearFilters();
  if (!searchData) {
    return null;
  }
  if (searchData.totalNumOfResults === 0) {
    return (
      <>
        <Stack spacing={1}>
          <Typography variant="h1">
            Sorry, your search for "{searchData!.searchPhrase}" returned no
            results
          </Typography>
          <AppliedFilters />
        </Stack>
        {!noFiltersApplied && (
          <ClearFilterButton label="Clear filters and search again" />
        )}
      </>
    );
  }
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="h1">
            Search results for "{searchData.searchPhrase}"
          </Typography>
        </Box>
        <Highlighter />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ padding: "0.5rem 0 2rem 0.5rem" }}
      >
        <Stack spacing={1}>
          <Typography paragraph sx={{ padding: 0, margin: 0 }}>
            {`${searchData.totalNumOfResults} ${
              searchData.totalNumOfResults === 1 ? "result" : "results"
            }`}
          </Typography>
          <AppliedFilters />
        </Stack>
        <PaginationSelector />
      </Stack>
      {searchData.searchResults.map((r, index) => (
        <SearchResult key={`${r.title.toLowerCase()}${index}`} {...r} />
      ))}
    </>
  );
}
