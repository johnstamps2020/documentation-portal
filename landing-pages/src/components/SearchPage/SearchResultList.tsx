import { useSearchData } from 'hooks/useApi';
import SearchResult from './SearchResult';
import ResultsSkeleton from './ResultsSkeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { StyledHeading2, StyledLink } from './StyledSearchComponents';
import Chip from '@mui/material/Chip';

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
          <Stack
            spacing={1}
            sx={{
              margin: '16px 0 32px 0',
              border: 'solid 2px gray',
              padding: '8px',
            }}
          >
            <Chip
              label="Experimental semantic search result"
              color="secondary"
              size="small"
              sx={{ width: 'fit-content' }}
            ></Chip>
            {/*@ts-ignore*/}
            <StyledLink href={searchData.vectorSearchResults[index].href}>
              <StyledHeading2 variant="h3">
                {/*@ts-ignore*/}
                {searchData.vectorSearchResults[index].title} | {/*@ts-ignore*/}
                {searchData.vectorSearchResults[index].doc_title}
              </StyledHeading2>
            </StyledLink>
            <Typography
              sx={{
                paddingBottom: '10px',
                lineHeight: '24px',
                textAlign: 'left',
                my: 0,
              }}
            >
              {/*@ts-ignore*/}
              {searchData.vectorSearchResults[index].body.substring(0, 300)}
            </Typography>
          </Stack>
        </Box>
      ))}
    </>
  );
}
