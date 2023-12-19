import { useSearchData } from 'hooks/useApi';
import SearchResult from './SearchResult';
import ResultsSkeleton from './ResultsSkeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StyledHeading2, StyledLink } from './StyledSearchComponents';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

export default function SearchResultList() {
  const { searchData, isLoading } = useSearchData();

  if (isLoading || !searchData) {
    return <ResultsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={6}>
      <Stack>
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
      <Stack>
        <Alert severity="warning" icon={false} sx={{ marginBottom: '16px' }}>
          Experimental semantic search results
        </Alert>
        {searchData.vectorSearchResults.map((vr, index) => (
          <Stack sx={{ paddingBottom: '24px' }}>
            {/*@ts-ignore*/}
            <StyledLink href={vr.href}>
              <StyledHeading2 variant="h3">
                {/*@ts-ignore*/}
                {vr.title} | {/*@ts-ignore*/}
                {vr.doc_title}
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
              {vr.body.substring(0, 300)}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Divider
        orientation="vertical"
        variant="fullWidth"
        flexItem
        sx={{ borderRightWidth: 3 }}
      />
      <Stack>
        <Alert severity="error" icon={false} sx={{ marginBottom: '16px' }}>
          Experimental hybrid search results
        </Alert>
        {searchData.hybridSearchResults.map((vr, index) => (
          <Stack sx={{ paddingBottom: '24px' }}>
            {/*@ts-ignore*/}
            <StyledLink href={vr.href}>
              <StyledHeading2 variant="h3">
                {/*@ts-ignore*/}
                {vr.title} | {/*@ts-ignore*/}
                {vr.doc_title}
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
              {vr.body.substring(0, 300)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
