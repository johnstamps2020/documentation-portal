import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { ServerSearchResult } from 'server/dist/types/serverSearch';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

export default function SearchResultTags(searchResult: ServerSearchResult) {
  const ListItem = styled('li')(() => ({
    margin: '0 4px 6px 0',
  }));
  const searchResultTags = [
    searchResult.product,
    searchResult.release && searchResult.release.length > 0
      ? searchResult.release
      : searchResult.version,
    searchResult.subject,
    searchResult.language,
    searchResult.doc_display_title || searchResult.doc_title,
  ]
    .flat()
    .filter(Boolean);
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
