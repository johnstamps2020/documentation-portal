import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import FileValidationWarning, {
  checkIfFileExists,
} from 'components/EntitiesAdminPage/PageAdminPage/FileValidationWarning';
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

function getEmptyFilters(entities: Entity[], entityName: string) {
  const emptyFilters: Entity = {
    label: '',
    url: '',
  };
  const entity = entities[0];
  let { uuid, ...entityNoId } = entity;
  if (entityName === 'page') {
    const missingFileInLandingPages = false;
    entityNoId = { ...entityNoId, missingFileInLandingPages };
  }
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
  const emptyFilters = getEmptyFilters(entities, entityName);
  const [filters, setFilters] = useState<Entity>(emptyFilters);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>(entities);

  useEffect(() => {
    function filterEntities() {
      return entities?.filter((entity) => {
        let matchesFilters = true;
        for (const [k, v] of Object.entries(filters)) {
          if (typeof v === 'boolean') {
            if (v && entity[k as keyof typeof entity] !== v) {
              matchesFilters = false;
            }
            if (
              k === 'missingFileInLandingPages' &&
              v &&
              !checkIfFileExists(entity.url)
            ) {
              matchesFilters = true;
            }
          } else if (
            typeof v === 'string' &&
            v !== '' &&
            !entity[k as keyof typeof entity]
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
    const filteredEntities = filterEntities();
    if (filteredEntities) {
      setFilteredEntities(sortEntities(filteredEntities));
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
              cardWarning={<FileValidationWarning path={url} />}
            />
          ))}
      </Box>
    </>
  );
}
