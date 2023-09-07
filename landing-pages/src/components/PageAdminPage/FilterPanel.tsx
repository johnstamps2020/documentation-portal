import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import PageList from './PageList';
import { usePages } from '../../hooks/useApi';
import { Page } from 'server/dist/model/entity/Page';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';

const emptyFilters = {
  path: '',
  title: '',
  component: '',
  searchFilters: {},
  internal: false,
  public: false,
  earlyAccess: false,
  isInProduction: false,
};

export default function FilterPanel() {
  const [filters, setFilters] = useState(emptyFilters);
  const { pages, isLoading, isError } = usePages();
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [page, setPage] = useState(1);
  const resultsPerPage = 12;
  const numberOfPages =
    filteredPages.length > resultsPerPage
      ? Math.ceil(filteredPages.length / resultsPerPage)
      : 1;
  const resultsOffset = page === 1 ? 0 : (page - 1) * resultsPerPage;

  useEffect(() => {
    function filterPages() {
      return pages?.filter((p) => {
        let matchesFilters = true;
        for (const [k, v] of Object.entries(filters)) {
          if (typeof v === 'boolean' && v && p[k as keyof typeof p] !== v) {
            matchesFilters = false;
          } else if (
            typeof v === 'string' &&
            v !== '' &&
            !p[k as keyof typeof p]
              ?.toString()
              ?.toLocaleLowerCase()
              .includes(v.toLocaleLowerCase())
          ) {
            matchesFilters = false;
          }
        }
        return matchesFilters;
      });
    }
    const filteredPages = filterPages();
    if (filteredPages) {
      setFilteredPages(sortPages(filteredPages));
    }
  }, [pages, filters]);

  if (isError || isLoading || !pages || !filters) {
    return null;
  }

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function handleChange(field: string, value: string | boolean) {
    setFilters({
      ...filters,
      [field]: value,
    });
    setPage(1);
  }

  function sortPages(pages: Page[]) {
    return pages.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      let result = 0;
      if (aTitle > bTitle) {
        result = 1;
      } else if (aTitle < bTitle) {
        result = -1;
      }
      return result;
    });
  }

  return (
    <Stack>
      <Button
        size="small"
        variant="text"
        sx={{ width: 'fit-content', marginBottom: '16px' }}
        onClick={() => setFilters(emptyFilters)}
      >
        Clear filters
      </Button>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <TextField
          label="Path"
          value={filters.path}
          onChange={(event) => handleChange('path', event.target.value)}
        />
        <TextField
          label="Title"
          value={filters.title}
          onChange={(event) => handleChange('title', event.target.value)}
        />
        <FormGroup row>
          {['internal', 'public', 'earlyAccess', 'isInProduction'].map(
            (key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    value={key}
                    checked={filters[key as keyof typeof filters] as boolean}
                    onChange={(event) =>
                      handleChange(key, event.target.checked)
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={key}
              />
            )
          )}
        </FormGroup>
      </Stack>
      <Divider variant="middle" sx={{ margin: '20px' }}>
        <Chip
          label={`Showing results: ${filteredPages.length}/${pages.length}`}
        ></Chip>
      </Divider>
      {numberOfPages > 1 && (
        <Pagination
          sx={{ alignSelf: 'center', margin: '16px 0' }}
          color="primary"
          count={numberOfPages}
          page={page}
          onChange={handleChangePage}
        />
      )}
      <PageList
        pages={filteredPages.slice(
          resultsOffset,
          resultsOffset + resultsPerPage
        )}
      />
    </Stack>
  );
}
