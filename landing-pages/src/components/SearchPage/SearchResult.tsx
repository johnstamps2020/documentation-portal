import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ServerSearchInnerHit,
  ServerSearchResult,
} from "server/dist/types/serverSearch";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledHeading2,
  StyledLink,
} from "./StyledSearchComponents";

export default function SearchResult(searchResult: ServerSearchResult) {
  const ListItem = styled("li")(() => ({
    margin: "0 4px 6px 0",
  }));

  const highlightedTermsUrlParam = `hl=${searchResult.uniqueHighlightTerms}`;

  return (
    <Stack sx={{ paddingBottom: "16px" }}>
      <StyledLink href={`${searchResult.href}?${highlightedTermsUrlParam}`}>
        <StyledHeading2
          dangerouslySetInnerHTML={{ __html: searchResult.title }}
        />
      </StyledLink>

      <Stack direction="row" spacing={1}>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            listStyle: "none",
            p: 0,
            m: 0,
          }}
          component="ul"
          elevation={0}
        >
          {searchResult.docTags.flat().map((t, tIndex) => (
            <ListItem key={tIndex}>
              <Chip label={t} variant="filled" size="small" color="primary" />
            </ListItem>
          ))}
        </Paper>
      </Stack>
      <Typography
        paragraph
        dangerouslySetInnerHTML={{ __html: searchResult.body }}
        sx={{
          padding: "1rem 0",
          lineHeight: "24px",
          textAlign: "left",
        }}
      />
      {searchResult.innerHits.length > 0 && (
        <StyledAccordion>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="inner-hit-panel-content"
            id="inner-hit-panel-header"
          >
            Also found in {searchResult.innerHits.length} pages with the same
            title
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Stack>
              {searchResult.innerHits.map((h: ServerSearchInnerHit, index) => (
                <StyledLink
                  key={`${h.label}${index}`}
                  href={`${h.href}?${highlightedTermsUrlParam}`}
                >
                  {h.tags.join(", ")}
                </StyledLink>
              ))}
            </Stack>
          </StyledAccordionDetails>
        </StyledAccordion>
      )}
    </Stack>
  );
}
