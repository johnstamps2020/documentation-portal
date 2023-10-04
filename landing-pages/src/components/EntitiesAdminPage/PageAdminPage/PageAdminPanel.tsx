import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { Page } from 'server/dist/model/entity/Page';
import { usePages } from '../../../hooks/useApi';
import PageAdminFilters, { Filters } from './PageAdminFilters';
import PageList from './PageList';

const emptyFilters: Filters = {
  path: '',
  title: '',
  component: '',
  searchFilters: {},
  internal: false,
  public: false,
  earlyAccess: false,
  isInProduction: false,
};

export default function PageAdminPanel() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
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
      <PageAdminFilters
        filters={filters}
        setFilters={setFilters}
        page={page}
        setPage={setPage}
        emptyFilters={emptyFilters}
      />
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
