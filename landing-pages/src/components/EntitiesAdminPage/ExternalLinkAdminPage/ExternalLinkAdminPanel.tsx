import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'server/dist/model/entity/ExternalLink';
import { useExternalLinks } from '../../../hooks/useApi';
import ExternalLinkAdminFilters from './ExternalLinkAdminFilters';
import { ExternalLinkFilters } from './ExternalLinkAdminFilters';
import ExternalLinkList from './ExternalLinkList';

const emptyFilters: ExternalLinkFilters = {
  url: '',
  label: '',
  internal: false,
  public: false,
  earlyAccess: false,
  isInProduction: false,
};

export default function ExternalLinkAdminPanel() {
  const [filters, setFilters] = useState<ExternalLinkFilters>(emptyFilters);
  const { externalLinks, isLoading, isError } = useExternalLinks();
  const [filteredExternalLinks, setFilteredExternalLinks] = useState<
    ExternalLink[]
  >([]);
  const [page, setPage] = useState(1);
  const resultsPerPage = 12;
  const numberOfPages =
    filteredExternalLinks.length > resultsPerPage
      ? Math.ceil(filteredExternalLinks.length / resultsPerPage)
      : 1;
  const resultsOffset = page === 1 ? 0 : (page - 1) * resultsPerPage;

  useEffect(() => {
    function filterExternalLinks() {
      return externalLinks?.filter((p) => {
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
    const filteredExternalLinks = filterExternalLinks();
    if (filteredExternalLinks) {
      setFilteredExternalLinks(sortExternalLinks(filteredExternalLinks));
    }
  }, [externalLinks, filters]);

  if (isError || isLoading || !externalLinks || !filters) {
    return null;
  }

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function sortExternalLinks(externalLinks: ExternalLink[]) {
    return externalLinks.sort((a, b) => {
      const aTitle = a.label.toLowerCase();
      const bTitle = b.label.toLowerCase();
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
      <ExternalLinkAdminFilters
        filters={filters}
        setFilters={setFilters}
        page={page}
        setPage={setPage}
        emptyFilters={emptyFilters}
      />
      <Divider variant="middle" sx={{ margin: '20px' }}>
        <Chip
          label={`Showing results: ${filteredExternalLinks.length}/${externalLinks.length}`}
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
      <ExternalLinkList
        externalLinks={filteredExternalLinks.slice(
          resultsOffset,
          resultsOffset + resultsPerPage
        )}
      />
    </Stack>
  );
}
