import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { SearchResultSource, ServerSearchResult } from '@doctools/server';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { languageLabels } from '../../../../vars';

export function createSearchResultTags(
  searchResult: ServerSearchResult | SearchResultSource
) {
  return [
    searchResult.product,
    searchResult.release && searchResult.release.length > 0
      ? searchResult.release
      : searchResult.version,
    searchResult.subject,
    languageLabels.find((l) => l.key === searchResult.language)?.label ||
      searchResult.language,
  ]
    .flat()
    .filter(Boolean);
}

export default function SearchResultTags(
  searchResult: ServerSearchResult | SearchResultSource
) {
  const ListItem = styled('li')(() => ({
    margin: '0 4px 6px 0',
  }));
  const searchResultTags = createSearchResultTags(searchResult);
  return (
    <Stack direction="row" spacing={1}>
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 0,
          m: 0,
        }}
        component="ul"
        elevation={0}
      >
        {searchResultTags.map((t, tIndex) => (
          <ListItem key={tIndex}>
            <Chip label={t} variant="filled" size="small" />
          </ListItem>
        ))}
      </Paper>
    </Stack>
  );
}
