import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ServerSearchInnerHit,
  ServerSearchResult
} from "@documentation-portal/dist/types/serverSearch";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export default function SearchResult(searchResult: ServerSearchResult) {
  const ListItem = styled("li")(() => ({
    margin: "0 4px 6px 0"
  }));

  const highlightedTermsUrlParam = `hl=${searchResult.uniqueHighlightTerms}`;

  return (
    <Stack sx={{ paddingBottom: "16px" }}>
      <Link href={`${searchResult.href}?${highlightedTermsUrlParam}`}>
        <Typography
          variant="h2"
          dangerouslySetInnerHTML={{ __html: searchResult.title }}
        />
      </Link>

      <Stack direction="row" spacing={1}>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            listStyle: "none",
            p: 0,
            m: 0
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
        variant="body1"
        dangerouslySetInnerHTML={{ __html: searchResult.body }}
      />
      {searchResult.innerHits.length > 0 && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="inner-hit-panel-content"
            id="inner-hit-panel-header"
          >
            Also found in {searchResult.innerHits.length} pages with the same
            title
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              {searchResult.innerHits.map((h: ServerSearchInnerHit, index) => (
                <Link
                  key={`${h.label}${index}`}
                  href={`${h.href}?${highlightedTermsUrlParam}`}
                >
                  {h.tags.join(", ")}
                </Link>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}
