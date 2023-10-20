import Stack from '@mui/material/Stack';
import { ServerSearchResult } from 'server/dist/types/serverSearch';
import Typography from '@mui/material/Typography';
import { StyledHeading2, StyledLink } from './StyledSearchComponents';
import SearchResultTags from './SearchResultTags';
import SearchResultInnerHits from './SearchResultInnerHits';

export default function SearchResult(searchResult: ServerSearchResult) {
  const highlightedTermsUrlParam = `hl=${searchResult.uniqueHighlightTerms}`;
  return (
    <Stack sx={{ paddingBottom: '24px' }}>
      <StyledLink href={`${searchResult.href}?${highlightedTermsUrlParam}`}>
        <StyledHeading2
          dangerouslySetInnerHTML={{ __html: searchResult.title }}
        />
      </StyledLink>
      <SearchResultTags {...searchResult} />
      <Typography
        paragraph
        dangerouslySetInnerHTML={{ __html: searchResult.body }}
        sx={{
          paddingBottom: '10px',
          lineHeight: '24px',
          textAlign: 'left',
          my: 0,
        }}
      />
      <SearchResultInnerHits {...searchResult} />
    </Stack>
  );
}
