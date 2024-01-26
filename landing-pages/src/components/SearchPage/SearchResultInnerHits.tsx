import Stack from '@mui/material/Stack';
import { SearchResultSource, ServerSearchResult } from '@doctools/server';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledHeading3,
  StyledLink,
} from './StyledSearchComponents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchResultTags from './SearchResultTags';
import { createSearchResultLink } from './SearchResult';

export default function SearchResultInnerHits(
  searchResult: ServerSearchResult
) {
  const highlightedTermsUrlParam = `hl=${searchResult.uniqueHighlightTerms}`;
  if (searchResult.innerHits.length === 0) {
    return null;
  }
  return (
    <StyledAccordion>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="inner-hit-panel-content"
        id="inner-hit-panel-header"
      >
        Also found in {searchResult.innerHits.length} pages with the same title
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Stack spacing={1}>
          {searchResult.innerHits.map((h: SearchResultSource, idx) => (
            <Stack spacing={1} key={idx}>
              <StyledLink href={`${h.href}?${highlightedTermsUrlParam}`}>
                <StyledHeading3>{createSearchResultLink(h)}</StyledHeading3>
              </StyledLink>
              <SearchResultTags {...h} />
            </Stack>
          ))}
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
