import { useSearchData } from 'hooks/useApi';
import SearchResult from './SearchResult';
import ResultsSkeleton from './ResultsSkeleton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

export default function SearchResultList() {
  const { searchData, isLoading } = useSearchData();

  if (isLoading || !searchData) {
    return <ResultsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={6}>
      <Stack sx={{ flex: 1 }}>
        <Alert severity="info" icon={false} sx={{ marginBottom: '16px' }}>
          Keyword search results
        </Alert>
        {searchData.searchResults.map((r, index) => (
          <SearchResult key={`${r.title.toLowerCase()}${index}`} {...r} />
        ))}
      </Stack>
      <Divider
        orientation="vertical"
        variant="fullWidth"
        flexItem
        sx={{ borderRightWidth: 3 }}
      />
      <Stack sx={{ flex: 1 }}>
        <Alert severity="warning" icon={false} sx={{ marginBottom: '16px' }}>
          Experimental semantic search results
        </Alert>
        {searchData.semanticSearchResults.map((vr, index) => (
          <SearchResult key={`${vr.title.toLowerCase()}${index}`} {...vr} />
        ))}
      </Stack>
      <Divider
        orientation="vertical"
        variant="fullWidth"
        flexItem
        sx={{ borderRightWidth: 3 }}
      />
      <Stack sx={{ flex: 1 }}>
        <Alert severity="error" icon={false} sx={{ marginBottom: '16px' }}>
          Experimental hybrid search results
        </Alert>
        {searchData.hybridSearchResults.map((hr, index) => (
          <SearchResult key={`${hr.title.toLowerCase()}${index}`} {...hr} />
        ))}
      </Stack>
    </Stack>
  );
}
