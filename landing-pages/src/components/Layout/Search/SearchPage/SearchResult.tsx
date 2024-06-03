import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SearchResultSource, ServerSearchResult } from '@doctools/components';
import SearchResultInnerHits from './SearchResultInnerHits';
import SearchResultTags from './SearchResultTags';
import { StyledHeading2, StyledLink } from './StyledSearchComponents';

export function createSearchResultLink(
  searchResult: ServerSearchResult | SearchResultSource
) {
  const docTitle = searchResult.doc_display_title || searchResult.doc_title;
  const topicTitle = searchResult.title;
  if (topicTitle.includes('|')) {
    return topicTitle.replace(/\|(.*)$/g, `| ${docTitle}`);
  }
  return `${topicTitle} | ${docTitle}`;
}

export default function SearchResult(searchResult: ServerSearchResult) {
  const highlightedTermsUrlParam = `hl=${searchResult.uniqueHighlightTerms}`;
  return (
    <Stack sx={{ paddingBottom: '24px' }}>
      <StyledLink href={`${searchResult.href}?${highlightedTermsUrlParam}`}>
        <StyledHeading2
          dangerouslySetInnerHTML={{
            __html: createSearchResultLink(searchResult),
          }}
        />
      </StyledLink>
      {/*searchResult.keywords && (
        <Typography
          paragraph
          dangerouslySetInnerHTML={{ __html: searchResult.keywords }}
        />
      )*/}
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
