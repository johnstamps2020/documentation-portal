import Stack from '@mui/material/Stack';
import {
  SearchResultSource,
  ServerSearchResult,
} from 'server/dist/types/serverSearch';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledLink,
} from './StyledSearchComponents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
        <Stack>
          {searchResult.innerHits.map((h: SearchResultSource, index) => (
            <StyledLink
              key={`${h.title}${index}`}
              href={`${h.href}?${highlightedTermsUrlParam}`}
            >
              {[h.product, h.version].flat().filter(Boolean).join(', ')}
            </StyledLink>
          ))}
        </Stack>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
