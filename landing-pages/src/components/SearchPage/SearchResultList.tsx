import { useSearchData } from 'hooks/useApi';
import SearchResult from './SearchResult';
import ResultsSkeleton from './ResultsSkeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function SearchResultList() {
  const { searchData, isLoading } = useSearchData();

  if (isLoading || !searchData) {
    return <ResultsSkeleton />;
  }

  return (
    <>
      {searchData.searchResults.map((r, index) => (
        <Box>
          <SearchResult key={`${r.title.toLowerCase()}${index}`} {...r} />
          <Divider variant="fullWidth"></Divider>
          <Stack spacing={1} sx={{ marginBottom: '8px' }}>
            <Typography variant="h3">
              {/*@ts-ignore*/}
              {searchData.vectorSearchResults[index]._source.title}
            </Typography>
            <Box>
              {/*@ts-ignore*/}
              {searchData.vectorSearchResults[index]._source.body.substring(
                0,
                300
              )}
            </Box>
          </Stack>
        </Box>
      ))}
    </>
  );
}
