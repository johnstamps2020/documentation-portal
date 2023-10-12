import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import EditButton from './EditButton';
import EntityCard from './EntityCard';
import EntityFilters from './EntityFilters';
import EntityLink from './EntityLink';

export type Entity = {
  label: string;
  url: string;
  [x: string]: string | boolean | any;
};

type EntityListWithFiltersProps = {
  entities: Entity[];
  entityName: string;
  FormComponent: React.ElementType;
  DuplicateButton: React.ElementType;
  DeleteButton: React.ElementType;
};

function getEmptyFilters(entities: Entity[]) {
  const emptyFilters: Entity = {
    label: '',
    url: '',
  };
  const entity = entities[0];
  const { uuid, ...entityNoId } = entity;
  for (const [k, v] of Object.entries(entityNoId)) {
    if (typeof v === 'boolean') {
      emptyFilters[k] = false;
    }

    if (typeof v === 'string') {
      emptyFilters[k] = '';
    }
  }
  return emptyFilters;
}

function sortEntities(entities: Entity[]) {
  return entities.sort((a, b) => {
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

export default function EntityListWithFilters({
  entities,
  entityName,
  DeleteButton,
  DuplicateButton,
  FormComponent,
}: EntityListWithFiltersProps) {
  const emptyFilters = getEmptyFilters(entities);
  const [filters, setFilters] = useState<Entity>(emptyFilters);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>(entities);

  useEffect(() => {
    function filterExternalLinks() {
      return entities?.filter((p) => {
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
      setFilteredEntities(sortEntities(filteredExternalLinks));
    }
  }, [entities, filters]);

  const [page, setPage] = useState(1);
  const resultsPerPage = 12;
  const numberOfPages =
    filteredEntities.length > resultsPerPage
      ? Math.ceil(filteredEntities.length / resultsPerPage)
      : 1;
  const resultsOffset = page === 1 ? 0 : (page - 1) * resultsPerPage;
  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  return (
    <>
      <EntityFilters
        emptyFilters={emptyFilters}
        filters={filters}
        page={page}
        setFilters={setFilters}
        setPage={setPage}
      />
      <Divider variant="middle" sx={{ margin: '20px' }}>
        <Chip
          label={`Showing results: ${filteredEntities.length}/${entities.length}`}
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            md: 'repeat(3, 1fr)',
            sm: 'repeat(2, 1fr)',
            xs: '1fr',
          },
          gap: 2,
          py: 6,
        }}
      >
        {filteredEntities
          .slice(resultsOffset, resultsOffset + resultsPerPage)
          .map(({ label, url }) => (
            <EntityCard
              key={`${label}_${url}`}
              title={label}
              cardContents={<EntityLink url={url} label={url} />}
              cardButtons={
                <>
                  <EditButton
                    buttonLabel={`Open ${entityName} editor`}
                    dialogTitle={`Update ${entityName} settings`}
                    formComponent={<FormComponent primaryKey={url} />}
                  />
                  <DuplicateButton primaryKey={url} />
                  <DeleteButton primaryKey={url} />
                </>
              }
            />
          ))}
      </Box>
    </>
  );
}
