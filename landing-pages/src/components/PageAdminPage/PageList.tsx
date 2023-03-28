import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { Page } from 'server/dist/model/entity/Page';
import FilterPanel from './FilterPanel';
import { usePages } from '../../hooks/useApi';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';

type PageListProps = {
  filters: Page;
};

export default function PageList({ filters }: PageListProps) {
  const { pages, isLoading, isError } = usePages();
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [page, setPage] = useState(1);
  const numberOfResults = 12;
  const numberOfPages =
    filteredPages.length > numberOfResults
      ? Math.ceil(filteredPages.length / numberOfResults)
      : 1;
  const resultsOffset = page === 1 ? 0 : (page - 1) * numberOfResults;

  useEffect(() => {
    const filteredPages = filterPages();
    if (filteredPages) {
      setFilteredPages(filteredPages);
    }
  }, [pages, filters]);

  if (isError || isLoading || !pages || !filters) {
    return null;
  }

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function filterPages() {
    return pages?.filter((p) => {
      let matchesFilters = true;
      for (const [k, v] of Object.entries(filters)) {
        if (typeof v === 'boolean' && p[k as keyof typeof p] !== v) {
          matchesFilters = false;
        } else if (
          typeof v === 'string' &&
          v !== '' &&
          !p[k as keyof typeof p]?.toString()?.includes(v)
        ) {
          matchesFilters = false;
        }
      }
      return matchesFilters;
    });
  }

  return (
    <Stack width="100%">
      <Divider variant="middle" sx={{ margin: '20px' }}>
        <Chip
          label={`Showing results: ${filteredPages.length}/${pages.length}`}
        ></Chip>
      </Divider>
      <Grid container gap={1}>
        {filteredPages
          .sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            let result = 0;
            if (aTitle > bTitle) {
              result = 1;
            } else if (aTitle < bTitle) {
              result = -1;
            }
            return result;
          })
          .slice(resultsOffset, resultsOffset + numberOfResults)
          .map(({ path, title }) => (
            <Grid key={path} xs={12} sm={6} md={3}>
              <Card sx={{ padding: 1, height: '100%' }}>
                <CardContent>
                  <Typography variant="h2">{title}</Typography>
                  <Typography variant="subtitle1" component="div">
                    {path}
                  </Typography>
                </CardContent>
                <CardActions>
                  <EditButton pagePath={path} />
                  <DeleteButton pagePath={path} />
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      {numberOfPages > 1 && (
        <Pagination
          count={numberOfPages}
          page={page}
          onChange={handleChangePage}
        />
      )}
    </Stack>
  );
}
