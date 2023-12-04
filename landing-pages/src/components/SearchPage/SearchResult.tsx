import Stack from '@mui/material/Stack';
import {
  SearchResultSource,
  ServerSearchResult,
} from 'server/dist/types/serverSearch';
import Typography from '@mui/material/Typography';
import { StyledHeading2, StyledLink } from './StyledSearchComponents';
import SearchResultTags from './SearchResultTags';
import SearchResultInnerHits from './SearchResultInnerHits';
import { languageLabels } from '../../vars';

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
  const searchResultTags = [
    searchResult.product,
    searchResult.release && searchResult.release.length > 0
      ? searchResult.release
      : searchResult.version,
    searchResult.subject || '',
    languageLabels.find((l) => l.key === searchResult.language)?.label ||
      searchResult.language,
  ]
    .flat()
    .filter(Boolean);
  return (
    <Stack sx={{ paddingBottom: '24px' }}>
      <StyledLink href={`${searchResult.href}?${highlightedTermsUrlParam}`}>
        <StyledHeading2
          dangerouslySetInnerHTML={{
            __html: createSearchResultLink(searchResult),
          }}
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
